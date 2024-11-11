import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerFeatureWishlistService {

  private apiUrl = 'api/wishlist';

  constructor(private http: HttpClient) {}

}

// models/wishlist-item.model.ts
export interface WishlistItem {
  id: number;
  name: string;
  imageUrl: string;
  dateAdded: Date;
  sizeAlertEnabled: boolean;
}
