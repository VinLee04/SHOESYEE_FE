// services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class TestOrderService {
  private apiUrl = environment.connectCoreUri;

  constructor(private http: HttpClient) {}

  updateOrder(orderData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderData.id}`, orderData);
  }

  getVnpayPaymentUrl(orderId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/vnpay-payment/${orderId}`);
  }
}
