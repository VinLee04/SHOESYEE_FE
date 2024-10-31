import { Injectable, OnInit, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { Product, FilterCriteria, ProductResponse, ProductsPageManagement } from '../interface/Product';
import { AuthService } from '../common/service/auth.service';
import { inject } from '@angular/core';
import { DATA_PRODUCTS } from './mockup';
import { ListSearchRequest, PageResponse } from '../interface/PageRequest';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService implements OnInit {
  private apiUrl = 'https://api.example.com/products';
  private useMockData = true; // Toggle between mock and real API
  authService = inject(AuthService);
  private currentProductSignal = signal<ProductsPageManagement | undefined>(
    undefined
  );
  private readonly API_URL = environment.connectCoreUri;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.authService.scrollToTop();
  }

  getProducts(filters: FilterCriteria): Observable<ProductResponse> {
    if (this.useMockData) {
      return this.getMockProducts(filters);
    } else {
      return this.getRealProducts(filters);
    }
  }

  private getRealProducts(
    filters: FilterCriteria
  ): Observable<ProductResponse> {
    let params = new HttpParams();
    Object.keys(filters).forEach((key) => {
      const value = filters[key as keyof FilterCriteria];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ProductResponse>(this.apiUrl, { params }).pipe(
      catchError(this.handleError),
      map((response) => this.processApiResponse(response, filters))
    );
  }

  private getMockProducts(
    filters: FilterCriteria
  ): Observable<ProductResponse> {
    return of(this.processProducts(DATA_PRODUCTS, filters)).pipe(delay(300));
  }

  private processProducts(
    products: Product[],
    filters: FilterCriteria
  ): ProductResponse {
    let filteredProducts = this.applyFilters(products, filters);
    console.log('cekkk', filteredProducts);
    filteredProducts = this.applySorting(
      filteredProducts,
      filters.sortOrder || 'asc'
    );
    const paginatedProducts = this.applyPagination(
      filteredProducts,
      filters.page || 1,
      filters.itemsPerPage || 10
    );

    return {
      products: paginatedProducts,
      totalItems: filteredProducts.length,
    };
  }

  private applyFilters(
    products: Product[],
    filters: FilterCriteria
  ): Product[] {
    return products.filter((product) => {
      return (
        (!filters.searchTerm ||
          product.name
            .toLowerCase()
            .includes(filters.searchTerm.toLowerCase())) &&
        (!filters.brand || product.brand === filters.brand) &&
        (!filters.color || product.colors.includes(filters.color)) &&
        (!filters.category || product.category === filters.category) &&
        (!filters.minPrice || product.price >= filters.minPrice) &&
        (!filters.maxPrice || product.price <= filters.maxPrice)
        // && (!filters.discounts || filters.discounts.includes(product.discountPercentage))
      );
    });
  }

  private applySorting(
    products: Product[],
    sortOrder: 'asc' | 'desc'
  ): Product[] {
    return products.sort((a, b) => {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    });
  }

  private applyPagination(
    products: Product[],
    page: number,
    itemsPerPage: number
  ): Product[] {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  }

  private processApiResponse(
    response: any,
    filters: FilterCriteria
  ): ProductResponse {
    // Xử lý response từ API thực tế nếu cần
    // Ví dụ: có thể cần áp dụng bộ lọc hoặc sắp xếp nếu API không hỗ trợ
    return {
      products: response.products || [],
      totalItems: response.totalItems || 0,
    };
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  ///
  getProductsPage(
    searchRequest: ListSearchRequest
  ): Observable<ProductsPageManagement> {
    return this.http
      .post<PageResponse>(
        `${this.API_URL}/users/specification/pagination`,
        searchRequest
      )
      .pipe(
        map((response) => {
          if (response && response.content) {
            const usersManagementPage = response.content.map((user: any) => ({
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role,
              address: user.address || '',
              salary: user.salary?.toString() || '',
              active: user.active,
              gender: user.gender,
              image: user.image || '',
              phone: user.phone || '',
              lastActive: user.lastActive,
              dateAdded: user.birthdate, // or dateAdded if available in your API
            }));

            const usersPage: ProductsPageManagement = {
              usersManagementPage,
              totalElements: response.totalElements,
              totalPages: response.totalPages,
              currentPage: response.pageable.pageNumber + 1,
              pageSize: response.pageable.pageSize,
            };

            this.currentProductSignal.set(usersPage);
            return usersPage;
          } else {
            throw new Error('Invalid response format');
          }
        }),
        catchError((error) => {
          console.error('Error fetching users:', error);
          return throwError(() => error);
        })
      );
  }

  getCurrentProductSignal() {
    return this.currentProductSignal;
  }

}
