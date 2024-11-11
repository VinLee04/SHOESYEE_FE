import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_DISCOUNTS, API_URL_PRODUCTS } from '../../../environment';

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

@Injectable({
  providedIn: 'root',
})
export class ProductManagementAddEditService {
  private apiUrl = 'your-api-url';

  constructor(private http: HttpClient) {}

  createProduct(formData: FormData): Observable<any> {
    return this.http.post(`${API_URL_PRODUCTS}/createProduct`, formData);
  }

  getColors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/colors`);
  }

  getDiscounts(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL_DISCOUNTS}`);
  }
}
