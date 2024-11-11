import { Component, OnInit } from '@angular/core';
import { CustomerFeatureWishlistService, WishlistItem } from './customer-feature-wishlist.service';
import { CommonModule } from '@angular/common';
import { HomeCartPageCustomerService } from '../../home-cart-page-customer/home-cart-page-customer.service';
interface Product {
  id: number;
  thumbnail: string;
  name: string;
  colors: string[];
  brandName: string;
  categoryName: string;
  price: number;
  discountId?: number;
  quantityInCart: number;
  hasBeenPurchased: boolean;
}
@Component({
  selector: 'app-customer-feature-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-feature-wishlist.component.html',
  styleUrl: './customer-feature-wishlist.component.scss',
})
export class CustomerFeatureWishlistComponent {
  removeFromWishlist(productId: number) {
    this.wishlistItems = this.wishlistItems.filter(
      (item) => item.id !== productId
    );
  }
  
  wishlistItems: Product[] = [
    {
      id: 1,
      thumbnail: 'https://picsum.photos/400/400?random=1',
      name: 'Nike Air Max 270',
      colors: ['#FF0000', '#000000', '#FFFFFF'],
      brandName: 'Nike',
      categoryName: 'Shoes',
      price: 150,
      discountId: 1,
      quantityInCart: 2,
      hasBeenPurchased: true,
    },
    {
      id: 2,
      thumbnail: 'https://picsum.photos/400/400?random=2',
      name: 'Adidas Ultraboost',
      colors: ['#0000FF', '#808080'],
      brandName: 'Adidas',
      categoryName: 'Shoes',
      price: 180,
      quantityInCart: 0,
      hasBeenPurchased: false,
    },
    {
      id: 3,
      thumbnail: 'https://picsum.photos/400/400?random=3',
      name: 'Puma RS-X',
      colors: ['#FFFF00', '#000000', '#FFFFFF'],
      brandName: 'Puma',
      categoryName: 'Shoes',
      price: 120,
      discountId: 2,
      quantityInCart: 1,
      hasBeenPurchased: false,
    },
    {
      id: 4,
      thumbnail: 'https://picsum.photos/400/400?random=4',
      name: 'Converse Chuck 70',
      colors: ['#000000', '#FFFFFF'],
      brandName: 'Converse',
      categoryName: 'Shoes',
      price: 85,
      quantityInCart: 0,
      hasBeenPurchased: true,
    },
    {
      id: 5,
      thumbnail: 'https://picsum.photos/400/400?random=5',
      name: 'New Balance 990',
      colors: ['#808080', '#000000'],
      brandName: 'New Balance',
      categoryName: 'Shoes',
      price: 175,
      quantityInCart: 1,
      hasBeenPurchased: true,
    },
  ];
}