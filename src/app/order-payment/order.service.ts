// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = environment.connectCoreUri;

  constructor(private http: HttpClient) {}

  getOrder(orderId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/${orderId}`);
  }

  updateOrder(orderData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderData.id}`, orderData);
  }

  getPaymentUrl(orderId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/payment/${orderId}`);
  }
}
