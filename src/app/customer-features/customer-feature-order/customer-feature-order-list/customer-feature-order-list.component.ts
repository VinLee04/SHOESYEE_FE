import { Component, computed, effect, Input, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../order.service';
import { OrderDetailResponse } from '../../../interface/Cart';
import { OrderResponseFull } from '../../../interface/Order';
import { API_URL_UPLOADS } from '../../../../environment';
import { OrderManagementService } from '../../../order-management/order.service';
import { switchMap } from 'rxjs';

interface DetailModalData {
  order: OrderResponseFull;
  detail: OrderDetailResponse;
}

@Component({
  selector: 'app-customer-feature-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-feature-order-list.component.html',
  styleUrl: './customer-feature-order-list.component.scss',
})
export class CustomerFeatureOrderListComponent {
  viewMode = signal<'compact' | 'detailed'>('compact');
  expandedOrderIds = signal<Set<number>>(new Set());
  orders = computed(() => this.orderService.getOrders()());
  selectedDetail = signal<DetailModalData | null>(null);

  constructor(
    private orderService: OrderService,
    private orderManagementService: OrderManagementService
  ) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId') || '';
    const initialStatus = 'WAITING_FOR_CONFIRMATION';

    this.orderService
      .getOrdersByUserAndStatus(userId, initialStatus)
      .subscribe({
        next: (orders) => {
          console.log('Initial orders loaded:', orders);
        },
        error: (err) => console.error('Error loading initial data:', err),
      });
  }

  viewDetailInfo(
    event: Event,
    order: OrderResponseFull,
    detail: OrderDetailResponse
  ) {
    event.stopPropagation();
    if (order && detail) {
      this.selectedDetail.set({ order, detail });
    }
  }

  viewOrder(order: OrderResponseFull | undefined) {
    if (order) {
      console.log('View order:', order);
      // Implement view order logic
    }
  }

  // Helper method to safely get the detail and order from selectedDetail signal
  getSelectedDetail(): DetailModalData | null {
    return this.selectedDetail();
  }

  getPaymentMethod(id: number | undefined) {
    return id === 1 ? 'Tiền Mặt' : id === 2 ? 'VNPAY' : undefined;
  }

  toggleOrderDetails(index: number) {
    const currentExpanded = new Set(this.expandedOrderIds());
    if (currentExpanded.has(index)) {
      currentExpanded.delete(index);
    } else {
      currentExpanded.add(index);
    }
    this.expandedOrderIds.set(currentExpanded);
  }

  isOrderExpanded(index: number): boolean {
    return this.expandedOrderIds().has(index);
  }

  setViewMode(mode: 'compact' | 'detailed') {
    this.viewMode.set(mode);
  }

  calculateDiscountedPrice(detail: OrderDetailResponse): number {
    if (!detail?.price || !detail?.discountPercent) return 0;
    return detail.price * (1 - detail.discountPercent / 100);
  }

  getImage(image: string) {
    return image
      ? `${API_URL_UPLOADS}/product-images/${image}`
      : `${API_URL_UPLOADS}/product-images/default.png`;
  }

  formatCurrency(amount: number | null | undefined): string {
    if (amount == null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }

  getStatusClass(status: string | null | undefined): string {
    if (!status) return 'default';
    return status.toLowerCase().replace(/_/g, '-');
  }

  getStatusColor(status: string | null | undefined): string {
    if (!status) return 'gray'; // Mặc định nếu trạng thái không tồn tại.

    const normalizedStatus = status.toLowerCase().trim();

    const statusColorMap: Record<string, string> = {
      waiting_for_confirmation: '#FFA500', // Màu cảnh báo
      confirmed: '#007BFF', // Màu thông tin
      processing: '#17A2B8', // Màu chính
      shipped: '#20C997', // Màu đã gửi
      delivered: '#28A745', // Màu thành công
      canceled: '#DC3545', // Màu nguy hiểm
      returned: '#FD7E14', // Màu trả lại
      refunded: '#FFC107', // Màu hoàn tiền
      failed: '#6C757D', // Màu lỗi
    };

    return statusColorMap[normalizedStatus] || 'gray'; // Mặc định nếu không khớp.
  }

  getStatusText(status: string | null | undefined): string {
    if (!status) return 'Không xác định';

    const statusMap: Record<string, string> = {
      WAITING_FOR_CONFIRMATION: 'Chờ xác nhận',
      CONFIRMED: 'Đã xác nhận',
      PROCESSING: 'Đang xử lý',
      SHIPPED: 'Đã gửi',
      DELIVERED: 'Đã giao',
      CANCELED: 'Đã hủy',
      RETURNED: 'Đã hoàn trả',
      REFUNDED: 'Đã hoàn tiền',
      FAILED: 'Thất bại',
    };

    return statusMap[status] || status;
  }

  showEditAddress(status: string | null | undefined): boolean {
    if (!status) return false;
    return ['WAITING_FOR_CONFIRMATION', 'CONFIRMED', 'PROCESSING'].includes(
      status
    );
  }

  editAddress(event: Event, order: OrderResponseFull) {
    event.stopPropagation();
    // Implement edit address logic
    console.log('Edit address for order:', order);
  }

  // Trong CustomerFeatureOrderListComponent
  cancelOrder(event: Event, order: OrderResponseFull) {
    event.stopPropagation();
    const userId = localStorage.getItem('userId') || '';
    const currentStatus = this.orderService.getCurrentStatus()();

    if (!currentStatus) {
      console.error('Missing userId or status');
      return;
    }

    // Thực hiện cancel và load lại data trong một chuỗi
    this.orderManagementService
      .cancelOrder(order.orderId)
      .pipe(
        // Sau khi cancel thành công, gọi tiếp API lấy orders mới
        switchMap(() =>
          this.orderService.getOrdersByUserAndStatus(userId, currentStatus)
        )
      )
      .subscribe({
        next: (orders) => {
          console.log('Orders reloaded after cancellation:', orders);
          // Signal sẽ được cập nhật thông qua service
          this.orderService.setOrders(orders);
        },
        error: (err) => console.error('Error in cancel order flow:', err),
      });
  }

  closeDetailModal(event: Event) {
    this.selectedDetail.set(null);
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

  getSafeValue<T>(value: T | null | undefined, defaultValue: T): T {
    return value ?? defaultValue;
  }
}
