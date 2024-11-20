import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckoutComponent } from '../checkout/checkout.component';
import { HomeCartPageCustomerService } from '../home-cart-page-customer/home-cart-page-customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeCartPageCustomerCheckoutComponent } from '../home-cart-page-customer/home-cart-page-customer-checkout/home-cart-page-customer-checkout.component';
import { API_URL_UPLOADS } from '../../environment';
import { ShoppingCartCheckoutStatusComponent } from './shopping-cart-checkout-status/shopping-cart-checkout-status.component';


export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  categoryName: string;
  brandName: string;
  discountPercent: number;
}

interface CartSummary {
  subtotal: number;
  shipping: number | string;
  discount: number;
  total: number;
}

export interface VNPAYReturn {
  code: string | null;
  message: string | null;
  orderId: string | null;
  paymentStatus: string | null;
  orderStatus: string | null;
}


@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CheckoutComponent,
    HomeCartPageCustomerCheckoutComponent,
    ShoppingCartCheckoutStatusComponent,
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent {
  protected cartService = inject(HomeCartPageCustomerService);
  protected showCheckout = false;
  showSummary = false;
  private router = inject(Router);

  vnpayReturn: VNPAYReturn = {
    code: null,
    message: null,
    orderId: null,
    paymentStatus: null,
    orderStatus: null,
  };

  code: string | null = null;
  message: string | null = null;
  orderId: string | null = null;
  paymentStatus: string | null = null;
  orderStatus: string | null = null;

  protected cartSummary: CartSummary = {
    subtotal: 0,
    discount: 0,
    shipping: "Free Ship",
    total: 0,
  };

  showCheckoutStatus: boolean = false;
  constructor(private route: ActivatedRoute) {
    this.getCheckoutByCard();
  }

  getImage(img: string){
    return img ? `${API_URL_UPLOADS}/product-images/${img}` : `${API_URL_UPLOADS}/product-images/default.png`
  }

  getCheckoutByCard() {
    const code = this.route.snapshot.queryParamMap.get('code');
    if (code) {
      this.vnpayReturn = {
        code: code,
        message: this.route.snapshot.queryParamMap.get('message'),
        orderId: this.route.snapshot.queryParamMap.get('orderId'),
        orderStatus: this.route.snapshot.queryParamMap.get('orderStatus'),
        paymentStatus: this.route.snapshot.queryParamMap.get('paymentStatus'),
      };
      this.showCheckoutStatus = true;
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.updateCartSummary();
    }, 100);
  }

  handleCloseCheckoutStatus() {
    this.showCheckoutStatus = false;
     this.router.navigate([], {
       relativeTo: this.route,
       queryParams: {},
       queryParamsHandling: null,
     });
  }

  protected updateQuantity(
    productDetailColorsId: number,
    newQuantity: number
  ): void {
    if (newQuantity < 1) return;

    this.cartService
      .updateQuantity(productDetailColorsId, newQuantity)
      .subscribe({
        next: () => {
          this.updateCartSummary();
          // alert('Cart updated successfully');
        },
      });
  }

  protected onInputChange(
    productDetailColorsId: number,
    newQuantity: number
  ): void {
    if (isNaN(newQuantity) || newQuantity < 1) {
      this.updateQuantity(productDetailColorsId, 1);
      return;
    }

    this.updateQuantity(productDetailColorsId, newQuantity);
  }

  protected removeItem(productDetailColorsId: number): void {
    // if (confirm('Are you sure you want to remove this item from your cart?')) {
    this.cartService.removeFromCart(productDetailColorsId).subscribe({
      next: () => {
        this.updateCartSummary();
      },
    });
    // }
  }

  protected clearCart(): void {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      this.cartService.clearCart();
      this.updateCartSummary();
      // alert('Cart cleared successfully');
    }
  }

  protected calculateSubtotal(): number {
    return this.cartService.totalAmount();
  }

  private updateCartSummary(): void {
    const subtotal = this.calculateSubtotal();

    this.cartSummary = {
      subtotal,
      shipping: this.cartSummary.shipping,
      discount: 0, // You can implement discount logic here
      total:
        subtotal + this.cartSummary.discount,
    };
  }

  protected continueShopping(): void {
    this.router.navigate(['/product']);
  }

  protected proceedToCheckout(): void {
    if (this.isCheckoutAvailable()) {
      this.showCheckout = true;
    } else {
      // alert('Please remove out of stock items before proceeding to checkout');
    }
  }

  protected isCheckoutAvailable(): boolean {
    return this.cartService.orderDetails.every(
      (item) => item.isProductDetailActive
    );
  }

  protected onCheckoutComplete(): void {
    this.showCheckout = false;
    this.cartService.clearCart();
    // alert('Order placed successfully!');
    this.router.navigate(['/orders']);
  }

  protected onCheckoutCancel(): void {
    this.showCheckout = false;
  }

}