import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { ApiResponse } from '../../interface/ApiResponse';
import { API_URL_FAVORITES, API_URL_UPLOADS } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerFeatureWishlistService {
  private apiUrl = API_URL_FAVORITES;

  constructor(private http: HttpClient) {}

  fetchFavoriteDate(userId: string): Observable<WishlistItem[]> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/getAllFavoriteByIdUser/${userId}`)
      .pipe(
        map((response: ApiResponse) => {
          if (response.result && Array.isArray(response.result)) {
            return response.result.map((item) => ({
              ...item,
              thumbnail: `${API_URL_UPLOADS}/product-images/${item.thumbnail}`,
            })) as WishlistItem[];
          } else {
            return [];
          }
        }),
        tap((response) => console.table(response))
      );
  }
}

// models/wishlist-item.model.ts
export interface WishlistItem {
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
