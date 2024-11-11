import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface PaymentMethod {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

interface Payment {
  id?: number;
  orderId: number;
  paymentMethodId: number;
  amount: number;
  paymentDate?: Date;
  transactionId?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  note?: string;
}
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
private apiUrl = environment.connectCoreUri;

  constructor(private http: HttpClient) {}

  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.apiUrl}/payment-methods`);
  }

  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/payments`, payment);
  }

  updatePaymentStatus(paymentId: number, status: Payment['status'], transactionId?: string): Observable<Payment> {
    return this.http.patch<Payment>(`${this.apiUrl}/payments/${paymentId}`, {
      status,
      transactionId
    });
  }
}
