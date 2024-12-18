import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../interface/ApiResponse';
import { API_URL_FAVORITES, API_URL_UPLOADS } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerFeatureWishlistService {

  private apiUrl = API_URL_FAVORITES;

  constructor(private http: HttpClient) {}

  fetchFavoriteDate(userId: string): Observable<WishlistItem[]>{
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/getAllFavoriteByIdUser/${userId}`)
      .pipe(
        map((response: ApiResponse) => {
          if (response.result) {
            const data = {
              ...response.result,
              image: `${API_URL_UPLOADS}/${response.result.thumbnail}`,
            };
            return data as WishlistItem[];
          } else {
            return [];
          }
        })
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
