import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { PageManagement, tableColumns } from '../interface/Table';
import { HttpClient } from '@angular/common/http';
import { ListSearchRequest, PageResponse } from '../interface/PageRequest';
import { API_URL_PRODUCTS, API_URL_UPLOADS } from '../../environment';
import { productInfo, ProductTable } from '../interface/Product';

@Injectable({
  providedIn: 'root',
})
export class ProductManagementService {
  private products: ProductTable[] = [
  ];

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductTable[]> {
    return of(this.products).pipe(delay(500)); // Simulate network delay
  }

  private readonly productPageSignal = signal<
    PageManagement<ProductTable> | undefined
  >(undefined);

  getProductPage(searchRequest: ListSearchRequest): Observable<PageManagement<ProductTable>>{
    return this.http.post<PageResponse>(`${API_URL_PRODUCTS}/specification/pagination/management`, searchRequest).pipe(
      map(({content, pageable, totalElements, totalPages}) => {
        if(!content) throw new Error("Hông có giá trị")

          const productPage: PageManagement<ProductTable> = {
            ItemsManagementPage: content.map((product: ProductTable) => ({
              ...product,
              thumbnail: product.thumbnail
                ? `${API_URL_UPLOADS}/product-images/${product.thumbnail}`
                : `${API_URL_UPLOADS}/product-images/default.png`,
            })),
            totalElements: totalElements,
            totalPages: totalPages,
            pageSize: pageable.pageSize,
            currentPage: pageable.pageNumber,
          };

          this.productPageSignal.set(productPage);
          return productPage;     
      })
    )
  }

  getProductPageSignal() {
    return this.productPageSignal;
  }

  getProductById(id: string): Observable<ProductTable> {
    const product = this.products.find((p) => p.id === id);
    if (product) {
      return of(product).pipe(delay(300)); // Simulate network delay
    } else {
      return throwError(() => new Error('Product not found'));
    }
  }

  addProduct(product: ProductTable): Observable<ProductTable> {
    const newProduct = { ...product, id: this.generateId() };
    this.products.push(newProduct);
    return of(newProduct).pipe(delay(500)); // Simulate network delay
  }

  updateProduct(updatedProduct: ProductTable): Observable<ProductTable> {
    const index = this.products.findIndex((p) => p.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
      return of(updatedProduct).pipe(delay(500)); // Simulate network delay
    } else {
      return throwError(() => new Error('Product not found'));
    }
  }

  deleteProduct(id: string): Observable<boolean> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      return of(true).pipe(delay(500)); // Simulate network delay
    } else {
      return throwError(() => new Error('Product not found'));
    }
  }

  getProductsByStatus(status: string): Observable<ProductTable[]> {
    return of(this.products.filter((p) => p.status === status)).pipe(
      delay(500)
    );
  }

  searchProducts(term: string): Observable<ProductTable[]> {
    const lowercaseTerm = term.toLowerCase();
    return of(
      this.products.filter(
        (p) =>
          p.name.toLowerCase().includes(lowercaseTerm) ||
          p.brandName.toLowerCase().includes(lowercaseTerm) ||
          p.categoryName.toLowerCase().includes(lowercaseTerm)
      )
    ).pipe(delay(500));
  }

  private generateId(): string {
    const lastId = this.products[this.products.length - 1]?.id || 'SP000';
    const numericPart = parseInt(lastId.slice(2)) + 1;
    return `SP${numericPart.toString().padStart(3, '0')}`;
  }

  getTopBestSellingProducts(limit: number = 5): Observable<TopSellingProduct[]> {
    return this.http.get<TopSellingProduct[]>(`${API_URL_PRODUCTS}/statistics/top-selling`, {
      params: { limit: limit.toString() }
    });
  }

  tableColumns: tableColumns[] = [
    { key: 'id', title: 'No.', sortable: false },
    { key: 'productInfo', title: 'Product', sortable: true },
    { key: 'stock', title: 'stock', sortable: true },
    { key: 'status', title: 'status', sortable: true },
    { key: 'categoryName', title: 'categoryName', sortable: true },
    { key: 'price', title: 'Price', sortable: true },
    { key: 'discountPercent', title: 'Discount', sortable: true, class: 'text-center'  },
    { key: 'action', title: 'Actions', sortable: false, class: 'text-center' },
  ];

  filterValues: {
    email?: string;
    phone?: string;
    role?: string;
    gender?: boolean | null;
    status?: boolean | null;
  } = {
    status: true,
  };
}

export interface TopSellingProduct {
  productId: number;
  productName: string;
  totalSold: number;
}