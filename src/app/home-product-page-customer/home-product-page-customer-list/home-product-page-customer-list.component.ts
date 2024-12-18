import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { API_URL_UPLOADS } from '../../../environment';
import { HomeProductPageCustomerService } from '../home-product-page-customer.service';
import { productInfo } from '../../interface/Product';
import { Router } from '@angular/router';
import { AuthService } from '../../common/service/auth.service';
import { FavoriteService } from './favourite.service';

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

  constructor(private router: Router, private auth:AuthService, private favService: FavoriteService) {}

  products = input.required<productInfo[]>();

  toggleFavorite(product: productInfo): void {
    if (product.liked) {
      this.favService.removeFromFavorite(product.id, this.auth.getUserId()!).subscribe(() => {
        product.liked = false;
      });
    } else {
      this.favService.addToFavorite(product.id, this.auth.getUserId()!).subscribe(() => {
        product.liked = true;
      });
    }
  }

  viewDetails(productId: number): void {
    this.router.navigate([`/product/viewDetail/${productId}`]);
  }

  addToCart(productId: number): void {
    // Implement add to cart functionality
    console.log('Add to cart:', productId);
  }

  loggedIn():boolean{
    return this.auth.isLoggedIn();
  }
}