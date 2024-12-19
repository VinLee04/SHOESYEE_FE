import { Component, computed, inject, input, signal } from '@angular/core';
import { DateFormatPipe } from '../../common/ts/date.format.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderManagementService } from '../order.service';
import { OrderResponseFull, OrderStatus } from '../../interface/Order';
import { OrderDetailResponse } from '../../interface/Cart';
import { API_URL_UPLOADS } from '../../../environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order-management-list',
  standalone: true,
  imports: [FormsModule, CommonModule, DateFormatPipe],
  templateUrl: './order-management-list.component.html',
  styleUrl: './order-management-list.component.scss',
})
export class OrderManagementListComponent {
  private orderService = inject(OrderManagementService);

  orders = input<OrderResponseFull[]>();
  selectedOrder = signal<OrderResponseFull | null>(null);
  showDetailModal = signal<boolean>(false);

  handleOrderAction(
    order: OrderResponseFull,
    action: 'accept' | 'cancel' | 'change',
    event: Event
  ) {
    event.stopPropagation();

    let actionObs: Observable<any>;

    switch (action) {
      case 'accept':
        actionObs = this.orderService.confirmOrder(order.orderId);
        break;
      case 'cancel':
        actionObs = this.orderService.cancelOrder(order.orderId);
        break;
      case 'change':
        alert(order.status);
        const nextStatus = this.getStatus(order.status);
        if (!nextStatus) {
          console.error('Invalid status transition');
          return;
        }
        actionObs = this.orderService.changeOrderStatus(
          order.orderId,
          nextStatus
        );
        break;
    }

    actionObs.subscribe({
      next: () => {
        if (this.showDetailModal()) {
          this.closeModal();
        }
      },
      error: (error) => {
        console.error(`Error ${action}ing order:`, error);
      },
    });
  }

  canChangeNext(status: string): boolean {
    return ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(
      status
    );
  }

  getStatus(status: string): string | undefined {
    switch (status) {
      case 'CONFIRMED':
        return 'processing';
      case 'PROCESSING':
        return 'ship';
      case 'SHIPPED':
        return 'outForDilivery';
      case 'OUT_FOR_DELIVERY':
        return 'dilivered';
      default:
        console.warn('Invalid status for change:', status);
        return undefined;
    }
  }
  
  getStatusShow(status: string): string | undefined {
    switch (status) {
      case 'CONFIRMED':
        return 'đang chuẩn bị';
      case 'PROCESSING':
        return 'đã giao';
      case 'SHIPPED':
        return 'gần đến';
      case 'OUT_FOR_DELIVERY':
        return 'đã nhận';
      default:
        console.warn('Invalid status for change:', status);
        return undefined;
    }
  }
  closeModal() {
    this.showDetailModal.set(false);
    this.selectedOrder.set(null);
    this.orderService.selectedOrder.set(null);
  }

  readonly mappedOrders = computed(() => {
    return this.orders()?.map((order) => ({
      ...order,
      formattedTotal: this.formatCurrency(order.totalAmount),
      totalItems: order.orderDetails.reduce(
        (sum, detail) => sum + detail.quantity,
        0
      ),
      paymentMethod: this.getPaymentMethod(order.paymentMethodId),
    }));
  });

  getPaymentMethod(id: number): string {
    return id === 1 ? 'Tiền mặt' : 'VNPAY';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  selectOrder(order: OrderResponseFull) {
    this.selectedOrder.set(order);
    this.orderService.selectedOrder.set(order);
    this.showDetailModal.set(true);
  }

  getOrderDetails(): OrderDetailResponse[] {
    const currentOrder = this.selectedOrder();
    if (!currentOrder?.orderDetails) {
      return [];
    }

    return currentOrder.orderDetails.map((detail, index) => ({
      ...detail,
      formattedPrice: this.formatCurrency(detail.price),
      formattedTotalPrice: this.formatCurrency(detail.totalPrice), // Đã loại bỏ phép nhân với quantity
      image: detail.image
        ? `${API_URL_UPLOADS}/product-images/${detail.image}`
        : `${API_URL_UPLOADS}/product-images/default.png`,
    }));
  }

  trackByOrderId(index: number, order: OrderResponseFull): number {
    return order.orderId;
  }

  trackByDetailId(index: number, detail: OrderDetailResponse): number {
    return detail.orderDetailId;
  }

  getFormattedDate(date: any): string {
    if (!date) return 'Chưa có';

    try {
      // Kiểm tra nếu date là mảng (chứa thông tin của một ngày)
      if (Array.isArray(date)) {
        // Tạo đối tượng Date từ mảng (cấu trúc [year, month, day, hour, minute, second, millisecond])
        date = new Date(
          Date.UTC(
            date[0], // year
            date[1] - 1, // month (mảng tháng bắt đầu từ 0)
            date[2], // day
            date[3], // hour
            date[4], // minute
            date[5], // second
            date[6] / 1000000 // nanosecond chuyển thành millisecond
          )
        );
      }

      // Định dạng lại ngày giờ theo định dạng 'vi-VN'
      const formattedDate = new Date(date).toLocaleDateString('vi-VN');
      return formattedDate !== 'Invalid Date' ? formattedDate : 'Chưa có';
    } catch {
      return 'Chưa có';
    }
  }
}