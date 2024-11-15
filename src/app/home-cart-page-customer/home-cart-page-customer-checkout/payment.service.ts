import { Injectable } from '@angular/core';
import { API_URL_ORDERS, API_URL_VNPAY, environment } from '../../../environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BaseService } from '../../common/service/base.service';
import { NotificationService } from '../../notification/notification.service';
import { ApiResponse, DataResponse } from '../../interface/ApiResponse';


export interface PaymentMethod {
  id: number;
  name: string;
  type: string;
  description: string;
  isActive: boolean;
}

export interface CheckoutRequest {
  userId: string;
  totalAmount: number;
  note: string | null;
  paymentMethodId: number | null;
  districtId: number | null;
  serviceTypeId: number | null;
  transportName: string | null;
  customerName: string | null;
  phone: string | null;
  wardCode: string | null;
  shipAddress: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService extends BaseService {
  private apiUrl = environment.connectCoreUri;

  constructor(private http: HttpClient, notificationService: NotificationService) {
    super(notificationService);
  }

  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.apiUrl}/payment-methods`);
  }

  createPayment(orderId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${API_URL_VNPAY}/${orderId}`);
  }

  placeOrder(orderId: number, orderData: CheckoutRequest): Observable<DataResponse<any>> {
    return this.http.put<ApiResponse>(`${API_URL_ORDERS}/${orderId}/checkout`, orderData).pipe(
      map((response) => this.handleResponse(response))
    );
  }
}
