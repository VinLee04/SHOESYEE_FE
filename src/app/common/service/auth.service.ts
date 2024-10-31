import { computed, effect, Injectable, signal, inject, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  catchError,
  finalize,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { ApiResponse } from '../../interface/ApiResponse';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environment';
import { NotificationService } from '../../notification/notification.service';
import { BaseService } from './base.service';
import { UserInfo } from '../../interface/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  private readonly API_URL = environment.connectCoreUri;

  private currentUserSignal = signal<UserInfo | null | undefined>(undefined);

  public isLoggedIn = computed(() => !!this.currentUserSignal());
  private loadingSignal = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    notificationService: NotificationService
  ) {
    super(notificationService);
    this.checkAuthStatus();
  }

  get currentUser(): UserInfo | null | undefined {
    return this.currentUserSignal();
  }

  checkAuthStatus(): void {
    if (isPlatformBrowser(this.platformId) && localStorage.getItem('token')) {
      this.getCurrentUser().subscribe(
        () => {
          // return this.currentUser;
          console.log('checkAuthStatus', this.currentUser);
        },
        () => this.logout()
      );
    }
  }

  getCurrentUser(): Observable<UserInfo> {
    return this.http.get<ApiResponse>(`${this.API_URL}/users/myInfo`).pipe(
      map((response) => {
        const user: UserInfo = {
          id: response.result.id,
          username: response.result.username,
          email: response.result.email,
          role: response.result.role,
          phone: response.result.phone,
          image: response.result.image,
          birthdate: response.result.birthdate,
          address: response.result.address,
          gender: response.result.gender == 'true' ? 'Male' : 'Female',
          totalOrder: response.result.totalOrder,
          totalExpenditure: response.result.totalExpenditure,
        };
        console.log('userrrr', user);
        this.currentUserSignal.set(user);
        return user;
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  login(userLog: any): Observable<boolean> {
    this.loadingSignal.set(true);

    return this.http
      .post<ApiResponse>(`${this.API_URL}/auth/login`, userLog)
      .pipe(
        map((response) => this.handleResponse(response)),
        tap((response: any) => {
          if (response.result.authenticated) {
            const token = response.result.token.replace('Bearer ', '');
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('token', token);
              localStorage.setItem('lastLogin', new Date().toISOString());
            }
          }
        }),
        switchMap(() => this.getCurrentUser().pipe(map(() => true))),
        catchError(this.handleError),
        finalize(() => {
          this.loadingSignal.set(false);
        })
      );
  }

  register(userRegis: any): Observable<Boolean> {
    this.loadingSignal.set(true);

    return this.http
      .post<ApiResponse>(`${this.API_URL}/auth/register`, userRegis)
      .pipe(
        map((response) => this.handleResponse(response)),
        tap((response: any) => {
          if (response.success) {
            this.router.navigate(['login']);
          }
        }),
        map(() => true),
        catchError(this.handleError.bind(this)),
        finalize(() => {
          this.loadingSignal.set(false);
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.currentUserSignal.set(undefined);
    this.router.navigate(['login']);
  }

  isNotStaff(): boolean {
    return this.hasRole('CUSTOMER') || !this.isLoggedIn();
  }

  sendPasswordResetEmail(email: string): Observable<any> {
    // Thêm kiểm tra email hợp lệ trước khi gửi yêu cầu
    if (!email || !this.validateEmail(email)) {
      return throwError(() => new Error('Invalid email format')); // Thêm thông báo lỗi nếu email không hợp lệ
    }

    return this.http
      .post<ApiResponse>(`${this.API_URL}/auth/forgot-password`, { email })
      .pipe(
        map((response) => {
          // Kiểm tra response.result.success từ server
          if (response.result && response.result.success) {
            return (
              response.result.message ||
              'Password reset email sent successfully'
            ); // Trả về thông báo thành công
          } else {
            throw new Error('Failed to send reset email'); // Thêm thông báo lỗi nếu không thành công
          }
        }),
        catchError((error) => {
          console.error('Error in sendPasswordResetEmail:', error);
          return throwError(
            () => new Error('Failed to send password reset email')
          ); // Thêm thông báo lỗi chi tiết hơn
        })
      );
  }

  verifyResetCode(code: string): Observable<any> {
    return this.http
      .post<ApiResponse>(`${this.API_URL}/auth/verify-reset-code`, { code })
      .pipe(
        map((response) => {
          // Kiểm tra response.result.success từ server
          if (response.result && response.result.success) {
            return response.result.message || 'Reset code is valid'; // Trả về thông báo nếu thành công
          } else {
            throw new Error('Invalid or expired reset code'); // Thêm thông báo lỗi nếu mã không hợp lệ
          }
        }),
        catchError((error) => {
          console.error('Error in verifyResetCode:', error);
          return throwError(() => new Error('Failed to verify reset code')); // Thêm thông báo lỗi chi tiết hơn
        })
      );
  }

  resetPassword(code: string, newPassword: string): Observable<any> {
    return this.http
      .post<ApiResponse>(`${this.API_URL}/auth/reset-password`, {
        code,
        newPassword,
      })
      .pipe(
        map((response) => {
          // Kiểm tra response.result.success từ server
          if (response.result && response.result.success) {
            return response.result.message || 'Password reset successfully'; // Trả về thông báo nếu thành công
          } else {
            throw new Error('Failed to reset password'); // Thêm thông báo lỗi nếu không thành công
          }
        }),
        catchError((error) => {
          console.error('Error in resetPassword:', error);
          return throwError(() => new Error('Failed to reset password')); // Thêm thông báo lỗi chi tiết hơn
        })
      );
  }

  refreshToken(): Observable<string> {
    return this.http
      .post<ApiResponse>(`${this.API_URL}/refresh-token`, {})
      .pipe(
        map((response) => {
          if (response.result.authenticated) {
            const token = response.result.token;
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('token', token);
            }
            return token;
          } else {
            throw new Error('Token refresh failed');
          }
        }),
        catchError(this.handleError)
      );
  }

  hasRole(roleName: string): boolean {
    return this.currentUser?.role.id === roleName || false;
  }

  updateUserInfo(userId: string, formData: FormData): Observable<ApiResponse> {
    return this.http
      .put<ApiResponse>(`${this.API_URL}/users/customer/${userId}`, formData)
      .pipe(
        map((response) => {
          this.handleResponse(response);
          return response;
        })
      );
  }

  // Hàm validateEmail đã được thêm vào để kiểm tra email hợp lệ
  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  scrollToBottom() {
    window.scroll({
      top: document.body.scrollHeight, 
      left: 0,
      behavior: 'smooth',
    });
  }

  checkCode(response: any) {
    if (response.code !== this.SUCCESS_CODE) {
      throw new Error(response.message || response.code);
    }
  }

  // async validateSomething(data: any): Promise<boolean> {
  //   try {
  //     const response = await this.http
  //       .post<ApiResponse>(`${this.API_URL}/validate`, data)
  //       .toPromise();

  //     return this.checkResponse(response as ApiResponse);
  //   } catch (error) {
  //     this.handleError(error);
  //     return false;
  //   }
  // }
}
