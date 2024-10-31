import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { API_URL_USERS } from '../../environment';
import { ApiResponse, DataResponse } from '../interface/ApiResponse';
import { ListSearchRequest, PageResponse } from '../interface/PageRequest';
import { PageManagement, tableColumns, UsersManagementTable } from '../interface/Table';
import { NotificationService } from '../notification/notification.service';
import { BaseService } from '../common/service/base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  private currentUserPageSignal = signal<
    PageManagement<UsersManagementTable> | undefined
  >(undefined);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    notificationService: NotificationService
  ) {
    super(notificationService);
  }

  getUsersPage(
    searchRequest: ListSearchRequest
  ): Observable<PageManagement<UsersManagementTable>> {
    return this.http
      .post<PageResponse>(
        `${API_URL_USERS}/specification/pagination/staffs`,
        searchRequest
      )
      .pipe(
        map((response: PageResponse) => {
          if (response && response.content) {
            const ItemsManagementPage = response.content.map(
              (user: UsersManagementTable) => ({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                address: user.address || '',
                salary: user.salary || 0,
                active: user.active,
                gender: user.gender,
                image: user.image || '',
                phone: user.phone || '',
                lastActive: user.lastActive,
                birthdate: user.birthdate,
              })
            );

            const usersPage: PageManagement<UsersManagementTable> = {
              ItemsManagementPage,
              totalElements: response.totalElements,
              totalPages: response.totalPages,
              currentPage: response.pageable.pageNumber + 1,
              pageSize: response.pageable.pageSize,
            };

            this.currentUserPageSignal.set(usersPage);
            return usersPage;
          } else {
            throw new Error('Invalid response format');
          }
        }),
        catchError((error) => {
          console.error('Error fetching users:', error);
          return throwError(() => error);
        })
      );
  }

  createStaff(staffData: FormData): Observable<DataResponse<any>> {
    return this.http
      .post<ApiResponse>(`${API_URL_USERS}`, staffData)
      .pipe(map((response) => this.handleResponse(response)));
  }

  updateStaff(staffId:string, staffData: FormData): Observable<DataResponse<any>> {
    return this.http
      .put<ApiResponse>(`${API_URL_USERS}/staff/${staffId}`, staffData)
      .pipe(map((response) => this.handleResponse(response)));
  }

  getCurrentUserPageSignal() {
    return this.currentUserPageSignal;
  }

  // createUser(userData: FormData): Observable<ApiResponse> {
  //   return this.http.post<ApiResponse>(`${API_URL_USERS}`, userData).pipe(
  //     catchError((error) => {
  //       console.error('Error creating user:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }

  // uploadUserImage(file: File): Observable<ApiResponse> {
  //   const formData = new FormData();
  //   formData.append('file', file);

  //   return this.http
  //     .post<ApiResponse>(`${API_URL_USERS}/upload-image`, formData)
  //     .pipe(
  //       catchError((error) => {
  //         console.error('Error uploading image:', error);
  //         return throwError(() => error);
  //       })
  //     );
  // }

  deleteUser(id: string): Observable<DataResponse<ApiResponse>> {
    return this.http
      .delete<ApiResponse>(`${API_URL_USERS}/${id}`)
      .pipe(map((response) => this.handleResponse(response)));
  }

  restoreUser(id: string): Observable<DataResponse<ApiResponse>> {
    return this.http
      .put<ApiResponse>(`${API_URL_USERS}/${id}/restore`, '')
      .pipe(map((response) => this.handleResponse(response)));
  }

  tableColumns: tableColumns[] = [
    { key: 'index', title: 'No.', sortable: false },
    { key: 'userInfo', title: 'User name', sortable: true },
    { key: 'phone', title: 'Phone', sortable: true },
    { key: 'gender', title: 'Gender', sortable: true },
    { key: 'role', title: 'Role', sortable: true },
    { key: 'salary', title: 'Salary', sortable: true },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      class: 'text-center',
    },
    { key: 'action', title: 'Actions', sortable: false, class: 'text-center' },
  ];

  filterValues: {
    email?: string;
    phone?: string;
    role?: string;
    gender?: boolean | null;
    status?: boolean | null;
  } = {
    status: true,
  };
}
