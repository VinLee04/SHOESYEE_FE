// order-management.component.ts
import { Component, computed, effect, signal } from '@angular/core';
import { OrderManagementService } from './order.service';
import { OrderManagementSearchComponent } from './order-management-search/order-management-search.component';
import { OrderManagementFilterComponent } from './order-management-filter/order-management-filter.component';
import { OrderManagementListComponent } from './order-management-list/order-management-list.component';
import { AttributeSearchRequest, GlobalOperator, ListSearchRequest, Operation } from '../interface/PageRequest';
import { ProductManagementFilterValue } from '../product-management/product-management.component';
import { SortEvent } from '../interface/Table';
import { finalize } from 'rxjs';
import { PaginationComponent } from '../common/pagination/pagination.component';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
  standalone: true,
  imports: [
    OrderManagementSearchComponent,
    OrderManagementFilterComponent,
    OrderManagementListComponent,
    PaginationComponent,
  ],
})
export class OrderManagementComponent {
  readonly currentPage = signal(1);
  private readonly PAGE_SIZE = 12;
  readonly loading = signal(false);

  readonly totalElements = computed(
    () => this.orderService.getOrderPageSignal()()?.totalElements ?? 0
  );

  readonly totalPages = computed(
    () => this.orderService.getOrderPageSignal()()?.totalPages ?? 0
  );

  readonly ordersData = computed(
    () => this.orderService.getOrderPageSignal()()?.ItemsManagementPage
  );

  constructor(private orderService: OrderManagementService) {
    effect(
      () => {
        this.loadPageData(this.currentPage());
      },
      { allowSignalWrites: true }
    );
  }

  loadPageData(page: number): void {
    const request = this.buildSearchRequest(page);

    this.loading.set(true);
    this.orderService
      .getOrderPage(request)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe();
  }

  private readonly sortState = signal<SortEvent>({
    column: 'id',
    direction: 'ASC',
  });

  private readonly searchState = signal({
    query: '',
    filters: {} as ProductManagementFilterValue,
  });

  handleSearch(searchTerm: string): void {
    this.searchState.update((state) => ({
      ...state,
      query: searchTerm,
    }));
    this.currentPage.set(1);
    this.loadPageData(1);
  }

  handlePageChange(page: number): void {
    this.currentPage.set(page);
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

  private buildAttributeSearchRequests(): AttributeSearchRequest[] {
    const { query, filters } = this.searchState();
    const requests: AttributeSearchRequest[] = [];

    if (query?.trim()) {
      requests.push(
        this.createSearchRequest('username', query, Operation.LIKE, 'user')
      );
    }

    if (filters.categoryName) {
      requests.push(
        this.createSearchRequest(
          'categoryName',
          filters.categoryName,
          Operation.EQUAL
        )
      );
    }

    if (filters.brandName) {
      requests.push(
        this.createSearchRequest(
          'brandName',
          filters.brandName,
          Operation.EQUAL
        )
      );
    }

    return requests;
  }

  private createSearchRequest(
    column: string,
    value: string,
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
}
