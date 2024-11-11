import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProductShowForUser } from '../../interface/Product';

// interface Product {
//   id: number;
//   name: string;
//   brand: string;
//   price: number;
//   image: string;
//   discountPercentage?: number;
//   colors: string[];
//   type: string;
// }

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  @Input() products$!: Observable<ProductShowForUser[]>;
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() favoriteIds: number[] = [];

  @Output() pageChange = new EventEmitter<number>();
  @Output() viewDetails = new EventEmitter<number>();
  @Output() addToCart = new EventEmitter<number>();
  @Output() favoriteToggle = new EventEmitter<number>();

  // isFavorite(productId: number): boolean {
  //   return this.favoriteIds.includes(productId);
  // }

  onPrevPage() {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  onNextPage() {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  onViewDetails(productId: number) {
    this.viewDetails.emit(productId);
  }

  onAddToCart(productId: number) {
    this.addToCart.emit(productId);
  }

  toggleFavorite(productId: number) {
    this.favoriteToggle.emit(productId);
  }
}
