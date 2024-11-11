import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductShowForUser } from '../interface/Product';
import { AttributeSearchRequest, GlobalOperator, ListSearchRequest, Operation } from '../interface/PageRequest';
import { API_URL_UPLOADS } from '../../environment';
import { PaginationComponent } from '../common/pagination/pagination.component';
import { ProductService } from './product.service';

interface FilterState {
  brand?: string;
  color?: string[];
  category?: string;
  sizes?: string[];
  minPrice?: number;
  maxPrice?: number;
  discounts?: string[];
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormsModule, CommonModule, PaginationComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  private readonly PAGE_SIZE = 20;
  currentPage = signal(1);
  loading = signal(false);
  thumbnailDefault = `${API_URL_UPLOADS}/products/detail.png`;
  filterValues: FilterState = {};
  searchQuery = '';
  sortDirection: 'ASC' | 'DESC' = 'ASC';
  sortColumn = 'id';


  readonly totalPages = computed(
    () => this.productService.getCurrentProductPageSignal()()?.totalPages ?? 0
  );
  readonly totalElements = computed(
    () =>
      this.productService.getCurrentProductPageSignal()()?.totalElements ?? 0
  );
  readonly products = computed(() =>
    this.mapProductData(this.productService.getCurrentProductPageSignal()())
  );

  constructor(private readonly productService: ProductService) {
    effect(
      () => {
        this.loadPageData(this.currentPage());
      },
      { allowSignalWrites: true }
    );
    this.filterValues = this.productService.filterValues;
  }

  ngOnInit(): void {
    this.loadPageData(1);
  }

  handlePageChange(page: number): void {
    this.currentPage.set(page);
  }

  handleSort(column: string, direction: 'ASC' | 'DESC'): void {
    this.sortColumn = column;
    this.sortDirection = direction;
    this.loadPageData(this.currentPage());
  }

  handleSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.resetAndLoad();
  }

  private resetAndLoad(): void {
    this.currentPage.set(1);
    this.loadPageData(1);
  }

  private loadPageData(page: number): void {
    const request = this.buildSearchRequest(page);

    this.loading.set(true);
    this.productService.getProductsPageShowForCustomer(request).subscribe({
      next: () => this.loading.set(false),
      complete: () => this.loading.set(false),
    });
  }

  private buildSearchRequest(page: number): ListSearchRequest {
    return {
      searchRequest: this.buildAttributeSearchRequests(),
      globalOperator: GlobalOperator.AND,
      pageDTO: {
        pageNo: page - 1,
        pageSize: this.PAGE_SIZE,
        sort: this.sortDirection,
        sortByColumn: this.sortColumn,
      },
    };
  }

  private buildAttributeSearchRequests(): AttributeSearchRequest[] {
    const requests: AttributeSearchRequest[] = [];

    if (this.searchQuery?.trim()) {
      requests.push(
        this.createSearchRequest('name', this.searchQuery, Operation.LIKE)
      );
    }

    // Add more filter requests based on filterValues
    if (this.filterValues.category) {
      requests.push(
        this.createSearchRequest(
          'categoryName',
          this.filterValues.category,
          Operation.EQUAL
        )
      );
    }

    if (this.filterValues.brand) {
      requests.push(
        this.createSearchRequest(
          'brandName',
          this.filterValues.brand,
          Operation.EQUAL
        )
      );
    }

    return requests;
  }

  private createSearchRequest(
    column: string,
    value: any,
    operation: Operation,
    joinTable?: string
  ): AttributeSearchRequest {
    return {
      column,
      value,
      operation,
      ...(joinTable && { joinTable }),
    };
  }

  private mapProductData(data: any): ProductShowForUser[] {
    return (
      data?.ItemsManagementPage.map((product: any) => ({
        ...product,
        price: product.price || '0',
        discountPercent: product.discountPercent || null,
        colors: product.colors || [],
        thumbnail: `${API_URL_UPLOADS}/product-images/${
          product.thumbnail || 'no-photo'
        }`,
      })) ?? []
    );
  }

  // UI Event Handlers
  viewDetails(id: number): void {
    console.log('View details for product:', id);
  }

  addToCart(id: number): void {
    console.log('Add to cart product:', id);
  }

  isFavorite(productId: number) {
    // return this.favorites.has(productId);
  }

  toggleFavorite(productId: number): void {
    // if (this.favorites.has(productId)) {
    //   this.favorites.delete(productId);
    // } else {
    //   this.favorites.add(productId);
    // }
  }
}
