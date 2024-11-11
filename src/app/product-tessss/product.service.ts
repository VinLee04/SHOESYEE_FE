// interfaces.ts

export interface Product {
  id?: number;
  name: string;
  brandId: number;
  thumbnail: string;
  categoryId: number;
  isActive: boolean;
  price: number;
  discountId?: number;
  stock: number;
  description: string;
  basicPrice: number;
}

export interface ProductDetail {
  id?: number;
  productId?: number;
  size: string;
  quantity: number;
  price: number;
  isActive: boolean;
}

export interface ProductColor {
  id?: number;
  productId: number;
  colorId: number;
  img: string; 
}

export interface ProductDetailColor {
  id?: number;
  productDetailId: number;
  productColorId: number;
}

// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL_DISCOUNTS } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class productService {
  private apiUrl = 'your-api-url';

  constructor(private http: HttpClient) {}

  createProduct(formData: FormData): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/products/create-with-details`,
      formData
    );
  }

  getColors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/colors`);
  }

  getDiscounts(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL_DISCOUNTS}`);
  }

}