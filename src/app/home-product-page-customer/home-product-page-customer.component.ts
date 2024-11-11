import { Component, computed, effect, inject, signal } from '@angular/core';
import { HomeProductPageCustomerService } from './home-product-page-customer.service';
import { PaginationComponent } from '../common/pagination/pagination.component';
import { AttributeSearchRequest, GlobalOperator, ListSearchRequest, Operation } from '../interface/PageRequest';
import { API_URL_UPLOADS } from '../../environment';
import { SortEvent } from '../interface/Table';
import { catchError, EMPTY, finalize, timeout } from 'rxjs';
import { HomeProductPageCustomerListComponent } from './home-product-page-customer-list/home-product-page-customer-list.component';
import { HomeProductPageCustomerFilterComponent } from './home-product-page-customer-filter/home-product-page-customer-filter.component';
import { HomeProductPageCustomerSearchComponent } from './home-product-page-customer-search/home-product-page-customer-search.component';
import { FilterService } from './home-product-page-customer-filter/home-product-page-customer-fiter.service';

interface PriceRange {
  min: number;
  max: number;
}

export interface FilterState {
  colors?: string;
  priceRange?: PriceRange;
  categories?: string;
  discounts?: string;
  brands?: string;
}


@Component({
  selector: 'app-home-product-page-customer',
  standalone: true,
  imports: [
    PaginationComponent,
    HomeProductPageCustomerListComponent,
    HomeProductPageCustomerFilterComponent,
    HomeProductPageCustomerSearchComponent,
  ],
  templateUrl: './home-product-page-customer.component.html',
  styleUrl: './home-product-page-customer.component.scss',
})
export class HomeProductPageCustomerComponent {
  private readonly PAGE_SIZE = 12;

  // Signals
  readonly currentPage = signal(1);
  readonly loading = signal(false);

  filterValues: FilterState = {};

  // Computed values from service
  readonly totalPages = computed(
    () => this.productService.getProductPageSignal()()?.totalPages ?? 0
  );
  readonly products = computed(
    () =>
      this.productService.getProductPageSignal()()?.ItemsManagementPage ?? []
  );

  // State management
  private sortState = signal<SortEvent>({
    column: 'id',
    direction: 'ASC',
  });

  private searchState = signal({
    query: '',
    filters: {} as FilterState,
  });

  filterService = inject(FilterService);
  
  constructor(private readonly productService: HomeProductPageCustomerService) {
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
    console.log('father: ', page);
    this.currentPage.set(page);
  }

  handleSearch(search: string): void {
    const query = search;
    this.searchState.update((state) => ({ ...state, query }));
    this.resetAndLoad();
  }

  handleSort({ column, direction }: SortEvent): void {
    this.sortState.set({ column, direction });
    this.loadPageData(this.currentPage());
  }

  handleFilterApplied(filters: FilterState): void {
    this.searchState.update((state) => ({
      ...state,
      filters: filters,
    }));
    this.resetAndLoad();
  }

  private resetAndLoad(): void {
    this.currentPage.set(1);
    this.loadPageData(1);
  }

  private buildSearchRequest(page: number): ListSearchRequest {
    return {
      searchRequest: this.buildAttributeSearchRequests(),
      globalOperator: GlobalOperator.AND,
      pageDTO: {
        pageNo: page - 1,
        pageSize: this.PAGE_SIZE,
        sort: this.sortState().direction,
        sortByColumn: this.sortState().column,
      },
    };
  }

  private loadPageData(page: number): void {
    this.loading.set(true);

    try {
      const request = this.buildSearchRequest(page);

      this.productService
        .getProductPage(request)
        .pipe(
          timeout(30000),
          catchError((error) => {
            console.error('Error loading products:', error);
            return EMPTY;
          }),
          finalize(() => {
            this.loading.set(false);
          })
        )
        .subscribe({
          next: (response) => {
            // Handle the response data here
          },
          error: (error) => {
            console.error('Error in subscription:', error);
          },
        });
    } catch (error) {
      console.error('Error building request:', error);
      this.loading.set(false);
    }
  }

  private buildAttributeSearchRequests(): AttributeSearchRequest[] {
    const { query, filters } = this.searchState();
    const requests: AttributeSearchRequest[] = [];

    // Search by name
    if (query?.trim()) {
      requests.push(this.createSearchRequest(
        'name',
        query,
        Operation.LIKE
      ));
    }

    // Filter by categories
    if (filters.categories?.length) {
      requests.push(this.createSearchRequest(
        'name',
        filters.categories.toString(),
        Operation.IN,
        'category'
      ));
    }

    // Filter by price range
    if (filters.priceRange &&
      (filters.priceRange.min > 0 || filters.priceRange.max > 0)) {
      requests.push(this.createSearchRequest(
        'price',
        `${filters.priceRange.min || 0},${filters.priceRange.max || Number.MAX_SAFE_INTEGER}`,
        Operation.BETWEEN
      ));
    }

    // Filter by colors
    if (filters.colors) {
      requests.push(this.createSearchRequest(
        'id',
        filters.colors,
        Operation.IN,
        'eee'
      ));
    }

    // Filter by discounts
    if (filters.discounts) {
      requests.push(this.createSearchRequest(
        'percent',
        filters.discounts,
        Operation.IN,
        'discount'
      ));
    }

    // Filter by brand
    if (filters.brands) {
      requests.push(this.createSearchRequest(
        'name',
        filters.brands,
        Operation.IN,
        'brand',
      ));
    }

    return requests;
  }

    private createSearchRequest(column: string, value: any, operation: Operation, joinTable?: string): AttributeSearchRequest {
    return {column, value, operation, ...(joinTable && { joinTable }),
    };
  }
}