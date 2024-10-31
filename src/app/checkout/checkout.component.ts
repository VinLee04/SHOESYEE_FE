import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../common/service/auth.service';

interface ProductCheck {
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  closeValue = output<boolean>();
  closeCheckout(){
    this.closeValue.emit(true);
  }
  authService = inject(AuthService);
  
  user = {
    name: this.authService.currentUser?.username,
    email: this.authService.currentUser?.email,
    phone: this.authService.currentUser?.phone,
  };

  selectedAddress: 'current' | 'new' = 'current';
  newAddress: string = '';
  paymentMethod: 'cod' | 'card' = 'cod';

  products: ProductCheck[] = [
    { name: 'Giày thể thao', price: 1000000, quantity: 1 },
    { name: 'Giày chạy bộ', price: 1500000, quantity: 2 },
  ];

  calculateTotal(): number {
    return this.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  }

  calculateDiscount(): number {
    // Giả sử giảm giá 10%
    return this.calculateTotal() * 0.1;
  }

  calculateFinalTotal(): number {
    return this.calculateTotal() - this.calculateDiscount();
  }

  placeOrder() {
    // Xử lý đặt hàng ở đây
    console.log('Đơn hàng đã được đặt!');
  }
}
