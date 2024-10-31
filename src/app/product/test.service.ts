
// src/app/services/product.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product, FilterCriteria, ProductResponse } from '../interface/product';

@Injectable({
  providedIn: 'root',
})
export class TestProductService {
  private apiUrl = 'https://api.example.com/products'; // Thay thế bằng URL API thực tế của bạn

  constructor(private http: HttpClient) {}

  getFilteredProducts(filters: FilterCriteria): Observable<ProductResponse> {
    let params = new HttpParams()
      .set('page', filters.page.toString())
      .set('itemsPerPage', filters.itemsPerPage.toString());

    if (filters.searchTerm) {
      params = params.set('search', filters.searchTerm);
    }
    if (filters.color) {
      params = params.set('color', filters.color);
    }
    if (filters.category) {
      params = params.set('category', filters.category);
    }
    if (filters.minPrice !== null && filters.minPrice !== undefined) {
      params = params.set('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
      params = params.set('maxPrice', filters.maxPrice.toString());
    }
    if (filters.sortOrder) {
      params = params.set('sortOrder', filters.sortOrder);
    }

    return this.http
      .get<ProductResponse>(this.apiUrl, { params })
      .pipe(
        catchError(
          this.handleError<ProductResponse>('getFilteredProducts', {
            products: [],
            totalItems: 0,
          })
        )
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  // Phương thức mô phỏng để sử dụng trong môi trường phát triển
  getMockProducts(filters: FilterCriteria): Observable<ProductResponse> {
    // Tạo dữ liệu mẫu
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Smartphone X',
        price: 999.99,
        colors: ['black', 'white', 'red'],
        type: 'Smartphone',
        brand: 'TechBrand',
        category: 'electronics',
        image: 'https://example.com/smartphone-x.jpg',
        discountPercentage: 10,
      },
      {
        id: 2,
        name: 'Laptop Pro',
        price: 1499.99,
        colors: ['silver', 'space gray'],
        type: 'Laptop',
        brand: 'TechBrand',
        category: 'electronics',
        image: 'https://example.com/laptop-pro.jpg',
      },
      // Thêm các sản phẩm mẫu khác ở đây
    ];

    // Áp dụng bộ lọc
    let filteredProducts = mockProducts.filter((product) => {
      if (
        filters.searchTerm &&
        !product.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      ) {
        return false;
      }
      if (filters.color && !product.colors.includes(filters.color)) {
        return false;
      }
      if (filters.category && product.category !== filters.category) {
        return false;
      }
      if (filters.minPrice !== null && filters.minPrice !== undefined && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== null && filters.maxPrice !== undefined && product.price > filters.maxPrice) {
        return false;
      }
      return true;
    });

    // Sắp xếp
    if (filters.sortOrder) {
      filteredProducts.sort((a, b) =>
        filters.sortOrder === 'asc' ? a.price - b.price : b.price - a.price
      );
    }

    // Phân trang
    const startIndex = (filters.page - 1) * filters.itemsPerPage;
    const endIndex = startIndex + filters.itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return of({
      products: paginatedProducts,
      totalItems: filteredProducts.length,
    });
  }
}
