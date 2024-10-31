// Import statements
import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { NotificationService } from '../notification/notification.service';
import { API_URL_PASSWORD } from '../../environment';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  ResetPasswordResponse,
  VerifyCodeRequest,
} from '../interface/Password';
import { ApiResponse, DataResponse } from '../interface/ApiResponse';
import { BaseService } from '../common/service/base.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService extends BaseService {
  private readonly API_URL = `${API_URL_PASSWORD}`;
  private blockTimeSubject = new BehaviorSubject<string>('');
  blockTime$ = this.blockTimeSubject.asObservable();
  private timerSubscription: Subscription | null = null;

  constructor(
    private http: HttpClient,
    notificationService: NotificationService
  ) {
    super(notificationService);
  }


  requestPasswordReset(
    email: string
  ): Observable<DataResponse<ResetPasswordResponse>> {
    return this.http
      .post<ApiResponse>(`${this.API_URL}/reset-request`, { email })
      .pipe(
        map((response) => this.handleResponse<ResetPasswordResponse>(response)),
        tap((dataResponse) => {
          if (dataResponse.success && dataResponse.result.remainingTime) {
            this.startBlockTimer(dataResponse.result.remainingTime);
          }
        })
      );
  }

  verifyAndResetPassword(data: VerifyCodeRequest): Observable<boolean> {
    return this.http
      .post<ApiResponse>(`${this.API_URL}/verify-reset`, data)
      .pipe(
        map((response) => {
          const isSuccess =
            this.handleResponse<ResetPasswordResponse>(response);
          return response.code === this.SUCCESS_CODE;
        })
      );
  }

  private startBlockTimer(remainingTime: number): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    const endTime = new Date().getTime() + remainingTime * 1000;

    this.timerSubscription = timer(0, 1000).subscribe(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance <= 0) {
        this.blockTimeSubject.next('');
        this.timerSubscription?.unsubscribe();
      } else {
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        this.blockTimeSubject.next(
          `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
        );
      }
    });
  }
}
