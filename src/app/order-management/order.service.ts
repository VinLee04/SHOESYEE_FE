import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, finalize, map, Observable, of } from 'rxjs';
import { OrderResponseFull, OrderStatus } from '../interface/Order';
import { ApiResponse } from '../interface/ApiResponse';
import { ListSearchRequest, PageResponse } from '../interface/PageRequest';
import { PageManagement } from '../interface/Table';
import { API_URL_ORDERS } from '../../environment';
import { BaseService } from '../common/service/base.service';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root',
})
export class OrderManagementService extends BaseService {
  private readonly orderPageSignal = signal<
    PageManagement<OrderResponseFull> | undefined
  >(undefined);
  selectedOrder = signal<OrderResponseFull | null>(null);
  private currentRequest = signal<ListSearchRequest | null>(null);

  constructor(
    private http: HttpClient,
    notificationService: NotificationService
  ) {
    super(notificationService);
  }

  getOrderPageSignal() {
    return this.orderPageSignal;
  }

  getCurrentRequest() {
    return this.currentRequest();
  }

  getOrderPage(
    listSearchRequest: ListSearchRequest
  ): Observable<PageManagement<OrderResponseFull>> {
    this.currentRequest.set(listSearchRequest);
    return this.http
      .post<PageResponse>(
        `${API_URL_ORDERS}/specification/pagination/management`,
        listSearchRequest
      )
      .pipe(
        map(({ content, totalPages, totalElements, pageable }) => {
          const orderPage: PageManagement<OrderResponseFull> = {
            ItemsManagementPage: content as OrderResponseFull[],
            currentPage: pageable.pageNumber + 1,
            pageSize: pageable.pageSize,
            totalElements: totalElements,
            totalPages: totalPages,
          };

          this.orderPageSignal.set(orderPage);
          return orderPage;
        })
      );
  }

  reloadCurrentPage(): Observable<PageManagement<OrderResponseFull>> | null {
    const currentReq = this.currentRequest();
    if (currentReq) {
      return this.getOrderPage(currentReq);
    }
    return null;
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http
      .delete<ApiResponse>(`${API_URL_ORDERS}/${orderId}/cancel`)
      .pipe(
        map((response) => this.handleResponse(response)),
        finalize(() => {
          const reloadObs = this.reloadCurrentPage();
          if (reloadObs) {
            reloadObs.subscribe();
          }
        })
      );
  }

  confirmOrder(orderId: number): Observable<any> {
    return this.http
      .put<ApiResponse>(`${API_URL_ORDERS}/${orderId}/confirm`, {})
      .pipe(
        map((response) => this.handleResponse(response)),
        finalize(() => {
          const reloadObs = this.reloadCurrentPage();
          if (reloadObs) {
            reloadObs.subscribe();
          }
        })
      );
  }

  changeOrderStatus(orderId: number, status: string | undefined): Observable<any> {
    return this.http
      .put<ApiResponse>(`${API_URL_ORDERS}/${orderId}/${status}`, {})
      .pipe(
        map((response) => this.handleResponse(response)),
        finalize(() => {
          const reloadObs = this.reloadCurrentPage();
          if (reloadObs) {
            reloadObs.subscribe();
          }
        })
      );
  }

  updateQuantityAfterOrder(id: number): Observable<any> {
    return this.http
      .post<ApiResponse>(`${API_URL_ORDERS}/DeductTheProductQuantityAfterOrdering/${id}`, {})
      .pipe(
        map((response) => this.handleResponse(response)),
        finalize(() => {
          const reloadObs = this.reloadCurrentPage();
          if (reloadObs) {
            reloadObs.subscribe();
          }
        })
      );
  }
}
