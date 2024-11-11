import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductShowForUser } from '../interface/Product';
import { ListSearchRequest, PageResponse } from '../interface/PageRequest';
import { API_URL_PRODUCTS, API_URL_UPLOADS, environment } from '../../environment';
import { PageManagement, tableColumns } from '../interface/Table';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private currentProductPageSignal = signal<
    PageManagement<ProductShowForUser> | undefined
  >(undefined);

  constructor(private http: HttpClient) {}

  getProductsPageShowForCustomer(
    searchRequest: ListSearchRequest
  ): Observable<PageManagement<ProductShowForUser>> {
    return this.http
      .post<PageResponse>(
        `${API_URL_PRODUCTS}/specification/pagination/customers`,
        searchRequest
      )
      .pipe(
        map((response: PageResponse) => {
          if (response && response.content) {
            const ItemsManagementPage = response.content.map(
              (product: ProductShowForUser) => ({
                id: product.id,
                thumbnail:
                  product.thumbnail == null
                    ? `${API_URL_UPLOADS}/products/default.png`
                    : product.thumbnail,
                name: product.name,
                price: product.price,
                colors: product.colors,
                brandName: product.brandName,
                categoryName: product.categoryName,
                discountPercent: product.discountPercent,
              })
            );

            const productsPage: PageManagement<ProductShowForUser> = {
              ItemsManagementPage,
              totalElements: response.totalElements,
              totalPages: response.totalPages,
              currentPage: response.pageable.pageNumber + 1,
              pageSize: response.pageable.pageSize,
            };

            this.currentProductPageSignal.set(productsPage);
            return productsPage;
          } else {
            throw new Error('Invalid response format');
          }
        })
      );
  }

  getCurrentProductPageSignal() {
    return this.currentProductPageSignal;
  }

  filterValues: {
    brand?: string;
    color?: string[];
    category?: string;
    sizes?: string[];
    minPrice?: number;
    maxPrice?: number;
    discounts?: string[];
  } = {};
}