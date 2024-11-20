// services/order.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { API_URL_ORDERS, API_URL_UPLOADS } from '../../../environment';
import { OrderResponseFull } from '../../interface/Order';
import { ApiResponse } from '../../interface/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly ordersSignal = signal<OrderResponseFull[]>([]);
  private currentStatusSignal = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  getOrders() {
    return this.ordersSignal;
  }

  getCurrentStatus() {
    return this.currentStatusSignal;
  }

  setOrders(orders: OrderResponseFull[]) {
    // Đảm bảo set một array mới để trigger computed
    this.ordersSignal.set([...orders]);
  }

  setCurrentStatus(status: string) {
    this.currentStatusSignal.set(status);
  }

  getOrdersByUserAndStatus(
    userId: string,
    status: string
  ): Observable<OrderResponseFull[]> {
    console.log('Service: Fetching orders for', { userId, status });
    const url = `${API_URL_ORDERS}/customer/${status}`;

    return this.http.get<ApiResponse>(url).pipe(
      map((response) => response.result),
      tap({
        next: (orders) => {
          console.log('Service: Received orders:', orders);
          this.setOrders(orders);
          this.setCurrentStatus(status);
        },
        error: (error) =>
          console.error('Service: Error fetching orders:', error),
      })
    );
  }
}