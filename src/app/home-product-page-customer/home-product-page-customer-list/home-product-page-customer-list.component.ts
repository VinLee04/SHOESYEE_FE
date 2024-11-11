import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { API_URL_UPLOADS } from '../../../environment';
import { HomeProductPageCustomerService } from '../home-product-page-customer.service';
import { productInfo } from '../../interface/Product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-product-page-customer-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home-product-page-customer-list.component.html',
  styleUrl: './home-product-page-customer-list.component.scss',
})
export class HomeProductPageCustomerListComponent {
  private readonly productService = inject(HomeProductPageCustomerService);
  readonly thumbnailDefault = `${API_URL_UPLOADS}/product-images/no-photo.png`;

  @Input() loading = false;

  constructor(private router: Router) {}

  private readonly favoriteProducts = signal<Set<number>>(new Set());

  products = input.required<productInfo[]>();

  isFavorite(productId: number): boolean {
    return this.favoriteProducts().has(productId);
  }

  toggleFavorite(productId: number): void {
    const favorites = new Set(this.favoriteProducts());
    if (favorites.has(productId)) {
      favorites.delete(productId);
    } else {
      favorites.add(productId);
    }
    this.favoriteProducts.set(favorites);
  }

  viewDetails(productId: number): void {
    this.router.navigate([`/product/viewDetail/${productId}`]);
  }

  addToCart(productId: number): void {
    // Implement add to cart functionality
    console.log('Add to cart:', productId);
  }
}