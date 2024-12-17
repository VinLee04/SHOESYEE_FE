
import { Injectable } from '@angular/core';
import { API_URL_REVIEWS } from '../../../environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces to match the Java DTOs
export interface ProductReviewResponse {
  reviewId: number;
  userId: string;
  userName: string;
  productName: string;
  size: number;
  reviewText: string;
  rating: number;
  reviewDate: Date;
}

export interface CreateReviewRequest {
  productDetailId: number;
  userId: string;
  reviewText: string;
  rating: number;
}

export interface CreateProductReviewResponse {
  productDetailId: number;
  userId: string;
  reviewText: string;
  rating: number;
  reviewDate: Date;
  verifiedPurchase: boolean;
}

export interface GetProductReviewForOneProductDetail {
  productDetailId: number;
  userId: string;
  reviewText: string;
  rating: number;
  reviewDate: Date;
  verifiedPurchase: boolean;
}

export interface GetProductReviewForOneProduct {
  userName: string;
  userImage: string;
  reviewText: string;
  size: number;
  color: string;
  rating: number;
  reviewDate: Date;
}
@Injectable({
  providedIn: 'root',
})
export class HomeProductDetailPageCustomerReviewDetailService {

  constructor(private http: HttpClient) {}

  // Create a new review
  createReview(
    request: CreateReviewRequest
  ): Observable<CreateProductReviewResponse> {
    return this.http.post<CreateProductReviewResponse>(
      `${API_URL_REVIEWS}/create`,
      request
    );
  }

  // Get reviews for a specific product detail
  getReviewsByProductDetail(
    productDetailId: number
  ): Observable<GetProductReviewForOneProductDetail[]> {
    return this.http.get<GetProductReviewForOneProductDetail[]>(
      `${API_URL_REVIEWS}/productDetailReview/${productDetailId}`
    );
  }

  // Get reviews for a specific product
  getReviewsByProductId(
    productId: number
  ): Observable<GetProductReviewForOneProduct[]> {
    return this.http.get<GetProductReviewForOneProduct[]>(
      `${API_URL_REVIEWS}/productReview/${productId}`
    );
  }

}
