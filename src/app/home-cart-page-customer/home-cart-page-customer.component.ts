import { Component } from '@angular/core';
import {  CartItemLocal, HomeCartPageCustomerService } from './home-cart-page-customer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-cart-page-customer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-cart-page-customer.component.html',
  styleUrl: './home-cart-page-customer.component.scss',
})
export class HomeCartPageCustomerComponent {
  constructor(public cartService: HomeCartPageCustomerService) {}

  addToCart(item: CartItemLocal) {
    this.cartService.addToCart(item.productDetailColorsId, item.quantity).subscribe(
      () => console.log('Item added successfully'),
      (error) => console.error('Error adding item:', error)
    );
  }
}
