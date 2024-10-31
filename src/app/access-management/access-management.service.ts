import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_URL_PERMISSIONS, API_URL_ROLES } from '../../environment';
import { BaseService } from '../common/service/base.service';
import { NotificationService } from '../notification/notification.service';
import { ApiResponse, DataResponse } from '../interface/ApiResponse';
import { Permission, Role, RolePermissionRequest } from '../interface/Access';

@Injectable({
  providedIn: 'root',
})
export class AccessManagementService extends BaseService {
  constructor(
    private http: HttpClient,
    notificationService: NotificationService
  ) {
    super(notificationService);
  }

  getRoleNames(): Observable<string[]> {
    return this.http
      .post<ApiResponse>(`${API_URL_ROLES}`, {
        idsOnly: true,
        haveAdmin: false,
      })
      .pipe(map((response) => response.result));
  }

  getRoles(): Observable<Role[]> {
    return this.http
      .post<ApiResponse>(`${API_URL_ROLES}`, {
        idsOnly: false,
        haveAdmin: false,
      })
      .pipe(map((response) => response.result));
  }

  getPermissions(): Observable<Permission[]> {
    return this.http
      .get<ApiResponse>(`${API_URL_PERMISSIONS}`)
      .pipe(map((response) => response.result));
  }

  updatePermission(permission:Permission): Observable<DataResponse<Permission>>{
    return this.http.put<ApiResponse>(`${API_URL_PERMISSIONS}`, permission).pipe(
      map((response) => this.handleResponse(response))
    )
  }
  createRoleWithPermissions(rolePermissions: RolePermissionRequest): Observable<DataResponse<ApiResponse>>{
    return this.http.post<ApiResponse>(
      `${API_URL_ROLES}/createWithPermissions`, rolePermissions).pipe(
        map((response) => this.handleResponse(response))
      )
  }

  updateRoleWithPermissions(rolePermissions: RolePermissionRequest): Observable<DataResponse<ApiResponse>>{
    return this.http.post<ApiResponse>(`${API_URL_ROLES}/updateWithPermissions`, rolePermissions).pipe(
      map((response) => this.handleResponse(response))
    )
  }

  createPermission(permission:Permission): Observable<DataResponse<Permission>>{
    return this.http.post<ApiResponse>(`${API_URL_PERMISSIONS}`, permission).pipe(
      map((response) => this.handleResponse(response))
    )
  }

  deletePermission(permissionId:string): Observable<DataResponse<void>>{
    return this.http.delete<ApiResponse>(`${API_URL_PERMISSIONS}/${permissionId}`).pipe(
      map((response) => this.handleResponse(response))
    );
  }

  deleteRole(roleId:string): Observable<DataResponse<void>>{
    return this.http.delete<ApiResponse>(`${API_URL_ROLES}/${roleId}`).pipe(
      map((response) => this.handleResponse(response))
    )
  }
}
