import { Injectable, signal } from '@angular/core';
import { BaseService } from '../common/service/base.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../notification/notification.service';
import { PageManagement } from '../interface/Table';
import { productInfo } from '../interface/Product';
import { ListSearchRequest, PageResponse } from '../interface/PageRequest';
import { map, Observable } from 'rxjs';
import { API_URL_PRODUCTS, API_URL_UPLOADS } from '../../environment';
import { FilterState } from './home-product-page-customer.component';
import { ApiResponse } from '../interface/ApiResponse';

type ProductFields = Pick<
  productInfo,
  | 'id'
  | 'brandName'
  | 'categoryName'
  | 'colors'
  | 'discountPercent'
  | 'name'
  | 'price'
  | 'thumbnail'
>;

@Injectable({
  providedIn: 'root',
})
export class HomeProductPageCustomerService extends BaseService {
  private readonly API_ENDPOINT = `${API_URL_PRODUCTS}/specification/pagination/customers`;
  private readonly productPageSignal = signal<
    PageManagement<productInfo> | undefined
  >(undefined);

  constructor(
    private readonly http: HttpClient,
    notificationService: NotificationService
  ) {
    super(notificationService);
  }

  getProductPageSignal() {
    return this.productPageSignal;
  }

  getProductPage(
    request: ListSearchRequest
  ): Observable<PageManagement<productInfo>> {
    return this.http.post<PageResponse>(this.API_ENDPOINT, request).pipe(
      map(({ content, pageable, totalElements, totalPages }) => {
        if (!content) throw Error('Invalid response format');

        const productPage: PageManagement<productInfo> = {
          ItemsManagementPage: content.map((product: ProductFields) => ({
            ...product,
            thumbnail: product.thumbnail
              ? `${API_URL_UPLOADS}/product-images/${product.thumbnail}`
              : `${API_URL_UPLOADS}/product-images/default.png`,
          })),
          currentPage: pageable.pageNumber,
          pageSize: pageable.pageSize,
          totalElements,
          totalPages,
        };

        this.productPageSignal.set(productPage);
        return productPage;
      })
    );
  }

  getColors(): Observable<any[]> {
    return this.http.get<any>(`${API_URL_UPLOADS}`);
  }

  getDiscounts(): Observable<any[]> {
    return this.http.get<any>(`${API_URL_UPLOADS}`);
  }

  getBrands(): Observable<any[]> {
    return this.http.get<any>(`${API_URL_UPLOADS}`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any>(`${API_URL_UPLOADS}`);
  }

  filterValues: FilterState = {};
}
