import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateReviewRequest, GetProductReviewForOneProduct, HomeProductDetailPageCustomerReviewDetailService } from './home-product-detail-page-customer-review-detail.service';
import { API_URL_UPLOADS } from '../../../environment';
import { AuthService } from '../../common/service/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home-product-detail-page-customer-review-detail',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl:
    './home-product-detail-page-customer-review-detail.component.html',
  styleUrl: './home-product-detail-page-customer-review-detail.component.scss',
})
export class HomeProductDetailPageCustomerReviewDetailComponent
  implements OnInit
{
  // Tab management
  // activeTab: 'details' | 'reviews' | 'discussion' = 'reviews';

  // Reviews data
  reviews: GetProductReviewForOneProduct[] = [];
  sortBy: 'newest' | 'highest' | 'lowest' = 'newest';

  // New review creation
  newReview = {
    productDetailId: 0,
    rating: 0,
    reviewText: '',
  };

  // Product data (simulated - in real app, this would come from a product service)
  product = {
    id: 1,
    averageRating: 0,
    ratingBreakdown: {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
    } as Record<string, number>,
  };

  // Popular brands (can be fetched from a service in a real app)
  popularBrands: string[] = [
    'Nike',
    'Adidas',
    'Puma',
    'Under Armour',
    'Reebok',
  ];

  constructor(
    private productReviewService: HomeProductDetailPageCustomerReviewDetailService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Fetch reviews for a specific product (replace with actual product ID)
    this.route.paramMap.subscribe((params) => {
      this.product.id = Number(params.get('id'));
    });
    this.fetchProductReviews(this.product.id);
  }

  // Process user image URL
  getUserImageUrl(userImage: string | null): string {
    if (!userImage) {
      return `${API_URL_UPLOADS}/avatars/default.png`;
    }
    return `${API_URL_UPLOADS}/${userImage}`;
  }

  // Fetch reviews for a specific product
  fetchProductReviews(productId: number) {
    this.productReviewService.getReviewsByProductId(productId).subscribe({
      next: (reviews) => {
        this.reviews = this.sortReviews(reviews);
        this.calculateRatingBreakdown(reviews);
      },
      error: (error) => {
        console.error('Error fetching reviews', error);
      },
    });
  }

  // Sort reviews based on selected criteria
  sortReviews(reviews: GetProductReviewForOneProduct[]): GetProductReviewForOneProduct[] {
    switch (this.sortBy) {
      case 'newest':
        return reviews.sort(
          (a, b) =>
            new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime()
        );
      case 'highest':
        return reviews.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return reviews.sort((a, b) => a.rating - b.rating);
      default:
        return reviews;
    }
  }

  // Calculate rating breakdown and average
  calculateRatingBreakdown(reviews: GetProductReviewForOneProduct[]) {
    // Reset rating breakdown
    this.product.ratingBreakdown = {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
    };

    // Calculate breakdown
    reviews.forEach((review) => {
      const roundedRating = Math.round(review.rating).toString();
      this.product.ratingBreakdown[roundedRating]++;
    });

    // Calculate average rating
    this.product.averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;
  }

  // Helper method to get rating percentage for breakdown bars
  getRatingPercentage(count: number): number {
    const totalReviews = this.reviews.length;
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  }

  // Method to render star rating
  renderStars(rating: number): string[] {
    return Array(5)
      .fill(0)
      .map((_, index) => (index < Math.round(rating) ? '⭐' : '☆'));
  }

  selectRating(rating: number) {
    // If the same star is clicked again, reset the rating
    this.newReview.rating = this.newReview.rating === rating ? 0 : rating;
  }
  auth = inject(AuthService);

  createReview() {
    if (this.newReview.rating === 0 || !this.newReview.reviewText.trim()) {
      alert('Please provide a rating and review text');
      return;
    }

    const reviewRequest: CreateReviewRequest = {
      productId: this.product.id, // Assuming product detail ID is the same as product ID for simplicity
      userId: this.auth.getUserId()!, // Replace with actual user ID from authentication
      reviewText: this.newReview.reviewText,
      rating: this.newReview.rating,
    };

    // Call service to create review
    this.productReviewService.createReview(reviewRequest).subscribe({
      next: () => {
        // Refresh reviews after successful creation
        this.fetchProductReviews(this.product.id);
        // Reset new review form
        this.newReview = {
          productDetailId: 0,
          rating: 0,
          reviewText: '',
        };
      },
      error: (error) => {
        console.error('Error creating review', error);
        alert('No order found for this product and user.');
      },
    });
  }
}