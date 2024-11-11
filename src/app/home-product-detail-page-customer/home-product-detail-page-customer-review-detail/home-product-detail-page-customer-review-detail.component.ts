import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface ProductDetail {
  id: number;
  name: string;
  price: number;
  mainImage: string;
  images: string[];
  sizes: string[];
  description: string;
  reviewCount: number;
  averageRating: number;
  reviews: Review[];
  isFavorite: boolean;
  ratingBreakdown: { [key: number]: number };
}

interface Review {
  id: number;
  userName: string;
  userImage: string;
  date: Date;
  rating: number;
  text: string;
  likes: number;
  comments: number;
}

@Component({
  selector: 'app-home-product-detail-page-customer-review-detail',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl:
    './home-product-detail-page-customer-review-detail.component.html',
  styleUrl: './home-product-detail-page-customer-review-detail.component.scss',
})
export class HomeProductDetailPageCustomerReviewDetailComponent {
  product!: ProductDetail;
  selectedSize!: string;
  activeTab: 'details' | 'reviews' | 'discussion' = 'details';
  newReview: Review = this.getEmptyReview();
  shippingCost: number = 0;
  popularBrands: string[] = ['Nike', 'Adidas', 'Puma', 'New Balance'];
  sortBy: string = 'newest';

  ngOnInit() {
    this.product = {
      id: 1,
      name: 'Shoes Reebok Zig Kinetica 3',
      price: 199.0,
      mainImage: 'shoes/shoesTest.png',
      images: [
        'shoes/shoesTest.png',
        'shoes/shoesTest.png',
        'shoes/shoesTest.png',
      ],
      sizes: ['40.5', '41', '42', '43', '43.5', '44', '44.5', '45', '46'],
      description: 'Excellent running shoes with sharp turns on the foot.',
      reviewCount: 43,
      averageRating: 4.8,
      reviews: [
        {
          id: 1,
          userName: 'Helen M.',
          userImage: 'ourteam/loi.png',
          date: new Date('2024-10-15'),
          rating: 5,
          text: 'Excellent running shoes. It turns very sharply on the foot.',
          likes: 42,
          comments: 0,
        },
        {
          id: 2,
          userName: 'Vĩnh Lợi',
          userImage: 'ourteam/loi.png',
          date: new Date('2024-10-12'),
          rating: 4,
          text: 'Good shoes',
          likes: 36,
          comments: 2,
        },
      ],
      isFavorite: false,
      ratingBreakdown: {
        5: 28,
        4: 9,
        3: 4,
        2: 1,
        1: 1,
      },
    };
    this.calculateShippingCost();
  }

  private getEmptyReview(): Review {
    return {
      id: 0,
      userName: '',
      userImage: '',
      date: new Date(),
      rating: 5,
      text: '',
      likes: 0,
      comments: 0,
    };
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  addToCart() {
    if (!this.selectedSize) {
      alert('Please select a size before adding to cart.');
      return;
    }
  }

  toggleFavorite() {
    this.product.isFavorite = !this.product.isFavorite;
  }

  submitReview() {
    if (!this.newReview.userName || !this.newReview.text) {
      alert('Please fill in all fields.');
      return;
    }
    this.newReview.id = this.product.reviews.length + 1;
    this.newReview.date = new Date();
    this.product.reviews.unshift({ ...this.newReview });
    this.updateRatingBreakdown(this.newReview.rating);
    this.resetNewReview();
  }

  private updateRatingBreakdown(rating: number) {
    this.product.ratingBreakdown[rating]++;
    this.product.reviewCount++;
    this.recalculateAverageRating();
  }

  private recalculateAverageRating() {
    let totalScore = 0;
    let totalReviews = 0;
    Object.entries(this.product.ratingBreakdown).forEach(([rating, count]) => {
      totalScore += Number(rating) * count;
      totalReviews += count;
    });
    this.product.averageRating = totalScore / totalReviews;
  }

  private resetNewReview() {
    this.newReview = this.getEmptyReview();
  }

  private calculateShippingCost() {
    this.shippingCost = this.product.price > 150 ? 0 : 10;
  }

  getMaxRatingCount(): number {
    return Math.max(...Object.values(this.product.ratingBreakdown));
  }

  getRatingPercentage(count: number): number {
    return (count / this.getMaxRatingCount()) * 100;
  }
}
