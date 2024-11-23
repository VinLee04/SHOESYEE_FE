import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderStatistics } from '../interface/Order';
import { ApiResponse } from '../interface/ApiResponse';
import { API_URL_ORDERS } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class OrderStatisticsService {
  constructor(private http: HttpClient) {}

  getFirstOrderDate(): Observable<any> {
    return this.http.get(`${API_URL_ORDERS}/first-order-date`);
  }

  getOrderStatistics(startDate: string, endDate: string): Observable<any> {
    return this.http.post(
      `${API_URL_ORDERS}/statistics/${startDate}/${endDate}`, {}
    );
  }
}
