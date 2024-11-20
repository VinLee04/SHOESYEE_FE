import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router, RouterModule } from '@angular/router';
import { CustomerFeatureOrderNavComponent } from './customer-feature-order-nav/customer-feature-order-nav.component';
import { CustomerFeatureOrderListComponent } from './customer-feature-order-list/customer-feature-order-list.component';
import { OrderService } from './order.service';
import { OrderDetailResponse, OrderResponse, OrderResponseStatus } from '../../interface/Cart';
import { API_URL_UPLOADS } from '../../../environment';
import { AuthService } from '../../common/service/auth.service';
import { OrderStatus } from '../../interface/Order';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-customer-feature-order',
  standalone: true,
  imports: [
    RouterModule,
    CustomerFeatureOrderListComponent,
    CustomerFeatureOrderNavComponent,
  ],
  templateUrl: './customer-feature-order.component.html',
  styleUrl: './customer-feature-order.component.scss',
})
export class CustomerFeatureOrderComponent {
  private ordersSignal = signal<OrderResponseStatus[]>([]);
  orderStatus = signal<string | null>(null);
  readonly orderItems = computed(() => this.mapOrderData(this.ordersSignal()));

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router // Thêm Router vào
  ) {}

  ngOnInit() {
    console.log('Component initialized');

    // Lắng nghe sự thay đổi của activated child route
    this.route.data.subscribe((data) => {
      console.log('Route data:', data);
    });

    // Quan trọng: Đây là cách đúng để lấy params từ named outlet
    this.router.events
      .pipe(
        filter((event) => event instanceof ActivationEnd),
        map((event) => event as ActivationEnd),
        filter((event) => event.snapshot.outlet === 'nav'),
        map((event) => event.snapshot.params),
        distinctUntilChanged((prev, curr) => prev['status'] === curr['status'])
      )
      .subscribe((params) => {
        console.log('Route params changed:', params);
        const status = params['status'];
        if (status) {
          this.orderStatus.set(status);
          const userId = this.authService.getUserId();
          if (typeof userId === 'string') {
            console.log('Calling API with status:', status);
            this.orderService
              .getOrdersByUserAndStatus(userId, status)
              .subscribe({
                next: (orders) => {
                  console.log('Received orders:', orders);
                  this.ordersSignal.set(orders);
                  this.orderService.setOrders(orders);
                },
                error: (error) => {
                  console.error('Error loading orders:', error);
                  this.ordersSignal.set([]);
                },
              });
          }
        }
      });
  }

  private mapOrderDetailData(detail: OrderDetailResponse): OrderDetailResponse {
    return {
      orderDetailId: Number(detail.orderDetailId) || 0,
      productDetailColorsId: Number(detail.productDetailColorsId) || 0,
      productDetailName: detail.productDetailName || '',
      price: Number(detail.price?.toFixed(2)) || 0,
      discountPercent: Number(detail.discountPercent) || 0,
      color: detail.color || '',
      image: detail.image
        ? `${API_URL_UPLOADS}/product-images/${detail.image}`
        : '`${API_URL_UPLOADS}/product-images/default.png`',
      totalPrice: Number(detail.totalPrice?.toFixed(2)) || 0,
      isProductDetailActive: Boolean(detail.isProductDetailActive),
      quantity: Number(detail.quantity) || 0,
      size: Number(detail.size) || 0,
    };
  }

  private mapOrderData(orders: OrderResponseStatus[]): OrderResponseStatus[] {
    return orders.map((order) => {
      if (!order) {
        // Trả về một đối tượng mặc định nếu order là null/undefined
        return this.getDefaultOrder();
      }

      try {
        return {
          shippedDate: order.shippedDate || new Date().toISOString(), // Đảm bảo luôn có giá trị string
          paymentDate: new Date(order.paymentDate || new Date()), // Đảm bảo luôn có giá trị Date
          totalAmount: Number(order.totalAmount?.toFixed(2)) || 0,
          note: order.note || '',
          paymentStatus: order.paymentStatus || '',
          transportName: order.transportName || '',
          customerName: order.customerName || '',
          phone: order.phone || '',
          orderDetails: Array.isArray(order.orderDetails)
            ? order.orderDetails.map((detail) =>
                this.mapOrderDetailData(detail)
              )
            : [],
        };
      } catch (error) {
        console.error('Error mapping order data:', error, order);
        return this.getDefaultOrder();
      }
    });
  }

  // Hàm tạo đối tượng OrderResponseStatus mặc định
  private getDefaultOrder(): OrderResponseStatus {
    return {
      shippedDate: new Date().toISOString(),
      paymentDate: new Date(),
      totalAmount: 0,
      note: '',
      paymentStatus: '',
      transportName: '',
      customerName: '',
      phone: '',
      orderDetails: [],
    };
  }
}