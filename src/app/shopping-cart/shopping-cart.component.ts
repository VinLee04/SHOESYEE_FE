import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckoutComponent } from '../checkout/checkout.component';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckoutComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent {
  showCheckOut:boolean = false;

  cartItems: CartItem[] = [
    {
      id: 1,
      name: 'Sofa For Living Room',
      price: 250.0,
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      quantity: 1,
    },
    {
      id: 2,
      name: 'Sofa For Living Room',
      price: 250.0,
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      quantity: 1,
    },
    {
      id: 3,
      name: 'Sofa For Living Room',
      price: 250.0,
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      quantity: 1,
    },
  ];

  couponCode: string = '';

  onInputChange(id: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newQuantity: number = Number(inputElement.value);
    this.updateQuantity(id, newQuantity);
  }

  updateQuantity(id: number, newQuantity: number): void {
    this.cartItems = this.cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    );
  }

  removeItem(id: number): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== id);
  }

  get subtotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  get discount(): number {
    return 0.28; // 28% discount
  }

  get total(): number {
    return this.subtotal * (1 - this.discount);
  }
}
