import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BaseService } from '../../common/service/base.service';
import { API_URL_FAVORITES } from '../../../environment';
import { NotificationService } from '../../notification/notification.service';
import { ApiResponse } from '../../interface/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService extends BaseService {
  private readonly API_ENDPOINT = `${API_URL_FAVORITES}`;
  constructor(
    private readonly http: HttpClient,
    notificationService: NotificationService
  ) {
    super(notificationService);
  }

  addToFavorite(productId: number, userId: string): Observable<any>{
    return this.http.post<ApiResponse>(`${this.API_ENDPOINT}`, { productId , userId });
  }

  removeFromFavorite(productId: number, userId: string): Observable<any>{
    return this.http.delete<ApiResponse>(`${this.API_ENDPOINT}/${userId}/${productId}`);
  }
}
