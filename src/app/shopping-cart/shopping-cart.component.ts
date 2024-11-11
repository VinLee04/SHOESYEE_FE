import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckoutComponent } from '../checkout/checkout.component';
import { HomeCartPageCustomerService } from '../home-cart-page-customer/home-cart-page-customer.service';
import { Router } from '@angular/router';
import { HomeCartPageCustomerCheckoutComponent } from '../home-cart-page-customer/home-cart-page-customer-checkout/home-cart-page-customer-checkout.component';
import { API_URL_UPLOADS } from '../../environment';


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
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}


@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CheckoutComponent,
    HomeCartPageCustomerCheckoutComponent,
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent {
  protected cartService = inject(HomeCartPageCustomerService);
  protected showCheckout = false;
  showSummary = false;
  private router = inject(Router);
  imageDefault = `${API_URL_UPLOADS}/products/default.png`;

  protected cartSummary: CartSummary = {
    subtotal: 0,
    shipping: 30000, // Fixed shipping cost
    tax: 0,
    discount: 0,
    total: 0,
  };

  ngOnInit() {
    setTimeout(() => {
      this.updateCartSummary();
    }, 100);
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
    const tax = subtotal * 0.1; // 10% tax

    this.cartSummary = {
      subtotal,
      shipping: this.cartSummary.shipping,
      tax,
      discount: 0, // You can implement discount logic here
      total:
        subtotal + this.cartSummary.shipping + tax - this.cartSummary.discount,
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

  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/placeholder-product.png';
  }
}