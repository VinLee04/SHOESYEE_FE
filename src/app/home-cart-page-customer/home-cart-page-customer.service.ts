import { computed, effect, Inject, inject, Injectable, Injector, PLATFORM_ID, signal } from '@angular/core';
import { API_URL_ORDERS, API_URL_UPLOADS, environment } from '../../environment';
import { AuthService } from '../common/service/auth.service';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { catchError, forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';
import { ApiResponse, DataResponse } from '../interface/ApiResponse';
import { BaseService } from '../common/service/base.service';
import { NotificationService } from '../notification/notification.service';

export interface CartItemLocal {
  productDetailColorsId: number;
  quantity: number;
}

export interface OrderDetailCart {
  orderDetailId?: number;
  productDetailName: string;
  price: number;
  discountPercent: number;
  color: string;
  image: string;
  totalPrice?: number;
  isProductDetailActive: boolean;
  size: number;
  cartItem: CartItemLocal;
}

export interface Order {
  orderId?: number;
  userId?: string;
  orderDate?: Date;
  shippedDate?: Date;
  shipAddress?: string;
  status?:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELED'
    | 'RETURNED'
    | 'REFUNDED'
    | 'FAILED';
  totalAmount?: number;
  note?: string;
  orderDetails?: OrderDetailCart[];
}


@Injectable({
  providedIn: 'root',
})
export class HomeCartPageCustomerService extends BaseService {
  private readonly API_URL = environment.connectCoreUri;
  private readonly GUEST_CART_KEY = 'guest_shopping_cart';

  // Signal chỉ lưu CartItemLocal
  private cartItemsSignal = signal<CartItemLocal[]>([]);

  // Signal riêng cho dữ liệu đầy đủ sau khi fetch
  private orderDetailsSignal = signal<OrderDetailCart[]>([]);

  // Signal cho order hiện tại
  private currentOrder = signal<Order | null>(null);

  public totalItems = computed(() =>
    this.cartItemsSignal().reduce((sum, item) => sum + item.quantity, 0)
  );

  public totalAmount = computed(() =>
    this.orderDetailsSignal().reduce(
      (sum, item) =>
        sum +
        item.price * (1 - item.discountPercent / 100) * item.cartItem.quantity,
      0
    )
  );

  private http = inject(HttpClient);
  private authService = inject(AuthService);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    notificationService: NotificationService
  ) {
    super(notificationService);
    effect(
      () => {
        const isLoggedIn = this.authService.isCustomerLoggedIn();

        setTimeout(() => {
          if (isLoggedIn) {
            this.handleUserLogin();
          } else {
            this.clearCart();
          }
        }, 0);
      },
      { injector: inject(Injector) }
    );

    this.initializeCart();
  }

  private initializeCart(): void {
    if (this.authService.isCustomerLoggedIn()) {
      this.fetchServerCart().subscribe();
    } else if (isPlatformBrowser(this.platformId)) {
      const localCart = localStorage.getItem(this.GUEST_CART_KEY);
      if (localCart) {
        const cartItems: CartItemLocal[] = JSON.parse(localCart);
        this.cartItemsSignal.set(cartItems);
        // Fetch chi tiết sản phẩm mới nhất
        this.fetchCartDetails(cartItems).subscribe();
      }
    }
  }
  public fetchCartDetails(
    cartItems: CartItemLocal[]
  ): Observable<OrderDetailCart[]> {
    // If cart is empty, reset signals and return empty array
    if (cartItems.length === 0) {
      this.orderDetailsSignal.set([]);
      this.cartItemsSignal.set([]);
      this.currentOrder.set({ orderDetails: [] });
      return of([]);
    }

    // Create requests for each cart item
    const requests = cartItems.map((item) =>
      this.http
        .get<any>(`${API_URL_ORDERS}/details/${item.productDetailColorsId}`)
        .pipe(
          map((response) => {
            // Map API response to OrderDetailCart interface
            const orderDetail: OrderDetailCart = {
              orderDetailId: response.result.orderDetailId,
              productDetailName: response.result.productDetailName,
              price: response.result.price,
              discountPercent: response.result.discountPercent,
              color: response.result.color,
              image: response.result.image ? `${API_URL_UPLOADS}/product-images/${response.result.image}` : `${API_URL_UPLOADS}/product-image/default.png`,
              isProductDetailActive: response.result.isProductDetailActive,
              totalPrice:
                response.result.price *
                (1 - response.result.discountPercent / 100) *
                item.quantity,
              cartItem: item,
              size: response.result.size,
            };
            return orderDetail;
          })
        )
    );

    // Use forkJoin to combine all requests
    return forkJoin(requests).pipe(
      map((orderDetails) => {
        // Calculate total amount
        const totalAmount = orderDetails.reduce(
          (sum, detail) => sum + (detail.totalPrice || 0),
          0
        );

        // Update signals
        this.orderDetailsSignal.set(orderDetails);
        this.cartItemsSignal.set(cartItems);

        // Create and update order
        const order: Order = {
          orderDetails: orderDetails,
          totalAmount: totalAmount,
          status: 'PENDING',
        };

        this.currentOrder.set(order);

        return orderDetails;
      }),
      catchError((error) => {
        console.error('Error fetching cart details:', error);
        // Reset signals on error
        this.orderDetailsSignal.set([]);
        this.cartItemsSignal.set([]);
        this.currentOrder.set({ orderDetails: [] });
        return throwError(() => error);
      })
    );
  }
  // Lưu chỉ CartItemLocal vào localStorage
  private saveLocalCart(cartItems: CartItemLocal[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.GUEST_CART_KEY, JSON.stringify(cartItems));
      this.cartItemsSignal.set(cartItems);
      // Fetch lại chi tiết sản phẩm sau khi lưu
      this.fetchCartDetails(cartItems).subscribe();
    }
  }

  private async handleUserLogin(): Promise<void> {
    const localCart = this.getLocalCart();
    if (localCart.length > 0) {
      await this.mergeCartsOnLogin(localCart).toPromise();
      this.clearLocalCart();
    }
    await this.fetchServerCart().toPromise();
  }

  private getLocalCart(): CartItemLocal[] {
    if (isPlatformBrowser(this.platformId)) {
      const cartJson = localStorage.getItem(this.GUEST_CART_KEY);
      return cartJson ? JSON.parse(cartJson) : [];
    }
    return [];
  }

  private clearLocalCart(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.GUEST_CART_KEY);
      this.cartItemsSignal.set([]);
      this.orderDetailsSignal.set([]);
      this.currentOrder.set(null);
    }
  }

  addToCart(productDetailColorsId: number, quantity: number): Observable<void> {
    if (this.authService.isCustomerLoggedIn()) {
      return this.addToServerCart({
        productDetailColorsId,
        quantity,
      }).pipe(map((response) => response.result));
    } else {
      const currentCart = this.getLocalCart();
      const existingItemIndex = currentCart.findIndex(
        (item) => item.productDetailColorsId === productDetailColorsId
      );

      if (existingItemIndex !== -1) {
        currentCart[existingItemIndex].quantity += quantity;
      } else {
        currentCart.push({ productDetailColorsId, quantity });
      }

      this.saveLocalCart(currentCart);
      return of(void 0);
    }
  }

  private addToServerCart(
    cartItem: CartItemLocal
  ): Observable<DataResponse<void>> {
    const userId = this.authService.getUserId();
    if (!userId) return throwError(() => new Error('User not authenticated'));

    return this.http
      .post<ApiResponse>(`${API_URL_ORDERS}`, {
        userId,
        cartItems: Array.of(cartItem),
      })
      .pipe(
        map((response) => {
          this.fetchServerCart().subscribe();
          return this.handleResponse<void>(response);
        })
      );
  }

  private mergeCartsOnLogin(localCart: CartItemLocal[]): Observable<void> {
    const userId = this.authService.getUserId();
    if (!userId) return throwError(() => new Error('User not authenticated'));

    return this.http.post<void>(`${API_URL_ORDERS}`, {
      userId,
      cartItems: localCart,
    });
  }

  private fetchServerCart(): Observable<Order> {
    const userId = this.authService.getUserId();

    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http
      .get<ApiResponse<Order>>(`${API_URL_ORDERS}/pending/${userId}`)
      .pipe(
        map((response: ApiResponse) => {
          if (!response.result) {
            throw new Error('No order found');
          }

          const order = response.result;
          order.orderDetails =
            order.orderDetails?.map((detail: any) => ({
              ...detail,
              cartItem: {
                productDetailColorsId: detail.productDetailColorsId,
                quantity: detail.quantity,
              },
            })) || [];

          // Update signals
          this.currentOrder.set(order);
          this.orderDetailsSignal.set(order.orderDetails);

          // Map and set cartItems
          const cartItems: CartItemLocal[] = order.orderDetails.map(
            (detail: any) => ({
              productDetailColorsId: detail.productDetailColorsId,
              quantity: detail.quantity,
            })
          );
          this.cartItemsSignal.set(cartItems);

          console.log('Order:', order);
          console.log('OrderDetails:', order.orderDetails);
          console.log('CartItems:', this.cartItemsSignal());

          return order;
        })
      );
  }

  getOrderDetails() {
    console.log('Current Order:', this.currentOrder());
    console.log('OrderDetails:', this.currentOrder()?.orderDetails);
    return this.currentOrder()?.orderDetails || [];
  }
  removeFromCart(productDetailColorsId: number): Observable<void> {
    if (this.authService.isCustomerLoggedIn()) {
      return this.removeFromServerCart(productDetailColorsId).pipe(
        map((response) => response.result)
      );
    } else {
      const currentCart = this.getLocalCart();
      const updatedCart = currentCart.filter(
        (item) => item.productDetailColorsId !== productDetailColorsId
      );
      this.saveLocalCart(updatedCart);
      return of(void 0);
    }
  }

  private removeFromServerCart(
    productDetailColorsId: number
  ): Observable<DataResponse<void>> {
    const userId = this.authService.getUserId();
    if (!userId) return throwError(() => new Error('User not authenticated'));

    return this.http
      .delete<any>(
        `${API_URL_ORDERS}/details/${userId}/item/${productDetailColorsId}`
      )
      .pipe(
        map((response) => {
          this.fetchServerCart().subscribe();
          return this.handleResponse<void>(response);
        })
      );
  }

  updateQuantity(
    productDetailColorsId: number,
    newQuantity: number
  ): Observable<void> {
    if (this.authService.isCustomerLoggedIn()) {
      return this.updateServerQuantity(productDetailColorsId, newQuantity);
    } else {
      const currentCart = this.getLocalCart();
      const itemIndex = currentCart.findIndex(
        (item) => item.productDetailColorsId === productDetailColorsId
      );

      if (itemIndex !== -1) {
        currentCart[itemIndex].quantity = newQuantity;
        this.saveLocalCart(currentCart);
      }

      return of(void 0);
    }
  }

  private updateServerQuantity(
    productDetailColorsId: number,
    newQuantity: number
  ): Observable<void> {
    const userId = this.authService.getUserId();
    if (!userId) return throwError(() => new Error('User not authenticated'));

    return this.http
      .put<void>(`${API_URL_ORDERS}/details/${userId}/quantity`, {
        productDetailColorsId,
        quantity: newQuantity,
      })
      .pipe(
        map(() => {
          this.fetchServerCart().subscribe();
        })
      );
  }

  placeOrder(shippingAddress: string, note?: string): Observable<Order> {
    const userId = this.authService.getUserId();
    if (!userId) return throwError(() => new Error('User not authenticated'));

    const order: Order = {
      userId: userId,
      shipAddress: shippingAddress,
      note,
      status: 'PENDING',
      orderDate: new Date(),
      orderDetails: this.orderDetails, // Sử dụng orderDetails đã fetch
      totalAmount: this.totalAmount(), // Sử dụng computed totalAmount
    };

    return this.http.post<Order>(`${this.API_URL}/orders`, order).pipe(
      map((newOrder) => {
        this.currentOrder.set(newOrder);
        // Clear cả hai signals sau khi đặt hàng thành công
        this.cartItemsSignal.set([]);
        this.orderDetailsSignal.set([]);
        return newOrder;
      })
    );
  }

  // Getters
  get cartItems(): CartItemLocal[] {
    return this.cartItemsSignal();
  }

  get orderDetails(): OrderDetailCart[] {
    return this.orderDetailsSignal();
  }

  get currentOrderValue(): Order | null {
    return this.currentOrder();
  }

  clearCart(): void {
    this.clearLocalCart();
    this.currentOrder.set(null);
  }
}