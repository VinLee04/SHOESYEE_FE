import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductManagementService } from './product-management.service';
import { ManagementTableComponent } from '../common/management-table/management-table.component';
import { SortEvent, tableColumns } from '../interface/Table';
import { RouterModule } from '@angular/router';
import { ProductTable } from '../interface/Product';
import { AttributeSearchRequest, GlobalOperator, ListSearchRequest, Operation } from '../interface/PageRequest';
import { finalize } from 'rxjs';
import { PaginationComponent } from '../common/pagination/pagination.component';

export interface ProductManagementFilterValue{
  categoryName?: string;
  brandName: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ManagementTableComponent,
    RouterModule,
    PaginationComponent,
  ],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],
})
export class ProductManagementComponent implements OnInit {
  columns: tableColumns[] = [];
  private readonly PAGE_SIZE = 7;
  selectedProduct: ProductTable | null = null;
  readonly loading = signal(false);
  readonly currentPage = signal(1);

  readonly totalElements = computed(
    () => this.productService.getProductPageSignal()()?.totalElements ?? 0
  );

  readonly totalPages = computed(
    () => this.productService.getProductPageSignal()()?.totalPages ?? 0
  );

  readonly products = computed(() =>
    this.mapProductData(this.productService.getProductPageSignal()())
  );

  constructor(private productService: ProductManagementService) {
     effect(
       () => {
         this.loadPageData(this.currentPage());
       },
       { allowSignalWrites: true }
     );
  }
  ngOnInit() {
    this.loadPageData(1);

    this.columns = this.productService.tableColumns;
  }

  private loadPageData(page: number): void {
    const request = this.buildSearchRequest(page);

    this.loading.set(true);
    this.productService
      .getProductPage(request)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe();
  }
  private sortState = signal<SortEvent>({
    column: 'id',
    direction: 'ASC',
  });

  private searchState = signal({
    query: '',
    filters: {} as ProductManagementFilterValue,
  });

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
      requests.push(this.createSearchRequest('name', query, Operation.LIKE));
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

  activeTab:
    | 'All Products'
    | 'Live'
    | 'Archive'
    | 'Out of Stock'
    | 'Low Stock' = 'All Products';
  changeTab(tab: typeof this.activeTab): void {
    this.activeTab = tab;
  }

  newProduct: ProductTable = {
    id: '',
    name: '',
    categoryName: '',
    brandName: '',
    status: '',
    thumbnail: '',
    description: '',
    price: 0,
    stock: 0,
    isActive: true,
    color: [],
  };

  // loadProducts() {
  //   this.productService.getProducts().subscribe(
  //     (products) => (this.products = products),
  //     (error) => console.error('Error loading products', error)
  //   );
  // }

  selectProduct(product: ProductTable) {
    this.selectedProduct = { ...product };
  }

  deleteProduct(product: ProductTable) {
    // this.productService.deleteProduct(product.id).subscribe(() => {
    //   this.loadProducts();
    //   if (this.selectedProduct && this.selectedProduct.id === product.id) {
    //     this.selectedProduct = null;
    //   }
    // });
  }

  private mapProductData(data: any): any[] {
    return (
      data?.ItemsManagementPage.map((product: any) => ({
        ...product,
        productInfo: {
          thumbnail: product.thumbnail,
          name: product.name,
          brand: product.brandName,
          category: product.categoryName,
        },
        discountPercent: product.discountPercent ? `${product.discountPercent}%` : "NOT IN DISCOUNT",
      })) ?? []
    );
  }

  onEditProduct(product: ProductTable) {
    this.selectedProduct = product;
  }

  onDeleteProduct(product: ProductTable) {
    // Handle delete
  }

  handlePageChange(page: number): void {
    this.currentPage.set(page);
  }

  // handleSort(event: SortEvent): void {
  //   this.sortColumn = this.COLUMN_MAP[event.column] || event.column;
  //   this.sortDirection = event.direction;
  //   this.loadPageData(this.currentPage());
  // }

  // handleSearch(event: Event): void {
  //   this.searchQuery = (event.target as HTMLInputElement).value;
  //   this.resetAndLoad();
  // }

  // handleFilterApplied(filterValues: Partial<UserManagementFilterValues>): void {
  //   this.filterValues = this.normalizeFilterValues(filterValues);
  //   this.resetAndLoad();
  // }
}
