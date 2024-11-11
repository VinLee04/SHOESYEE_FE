import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CartItem } from "./shopping-cart.component";

// cart.service.ts
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'api/cart'; // Adjust based on your API endpoint

  constructor(private http: HttpClient) {}

  getCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl);
  }

  updateQuantity(itemId: number, quantity: number): Observable<CartItem> {
    return this.http.patch<CartItem>(`${this.apiUrl}/${itemId}`, { quantity });
  }

  removeItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${itemId}`);
  }

  batchUpdate(updates: { id: number; quantity: number }[]): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/batch`, { updates });
  }
}
