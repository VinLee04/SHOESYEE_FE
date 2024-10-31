import { Component, computed, OnInit, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterCriteria, Product, ProductResponse } from '../interface/Product';
import { ProductService } from './product.service';
import { Router } from '@angular/router';
import { AttributeSearchRequest, GlobalOperator, ListSearchRequest, Operation } from '../interface/PageRequest';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  filteredProducts$: Observable<Product[]>;
  private productsSubject = new BehaviorSubject<Product[]>([]);

  private favorites: Set<number> = new Set();

  constructor(private productService: ProductService, private router: Router) {
    this.filteredProducts$ = this.productsSubject.asObservable();
  }

  searchTerm: string = '';
  selectedColor: string = '';
  selectedBrand: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedCategory: string = '';
  selectedSizes: number[] = [];
  selectedDiscounts: number[] = [];
  sortOrder: 'asc' | 'desc' = 'asc';

  itemsPerPage: number = 12;
  totalItems: number = 0;

  showSizeFilter: boolean = false;

  brands: string[] = ['Adidas', 'Nike', 'Puma', 'Reebok', 'New Balance'];
  colors: string[] = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'];
  categories: string[] = ['Shoes', 'Clothing', 'Accessories'];
  sizes: number[] = [10, 20, 30, 40, 50];
  discounts: number[] = [10, 20, 30, 40, 50];

  ngOnInit() {
    this.loadProducts();
  }

  totalPages: number = 0;
  loadProducts() {
    const filters: FilterCriteria = {
      searchTerm: this.searchTerm,
      color: this.selectedColor,
      brand: this.selectedBrand,
      category: this.selectedCategory,
      sizes: this.selectedSizes,
      discounts: this.selectedDiscounts,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      sortOrder: this.sortOrder,
      page: this.currentPage,
      itemsPerPage: this.itemsPerPage,
    };

    this.productService.getProducts(filters).subscribe(
      (response: ProductResponse) => {
        this.productsSubject.next(response.products);
        this.totalItems = response.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        console.log(this.productsSubject.value);
        console.log(this.totalItems);
        console.log(this.totalPages);
      },
      (error: Error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  onSearchChange() {
    this.currentPage = 1;
    this.loadProducts();
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadProducts();
  }

  clearSearch() {
    this.searchTerm = '';
    this.onSearchChange();
  }

  clearFilters() {
    this.selectedColor = '';
    this.selectedBrand = '';
    this.selectedCategory = '';
    this.selectedSizes = [];
    this.selectedDiscounts = [];
    this.minPrice = null;
    this.maxPrice = null;
    this.sortOrder = 'asc';
    this.applyFilters();
  }

  clearAll() {
    this.clearSearch();
    this.clearFilters();
  }

  toggleSizeFilter() {
    this.showSizeFilter = !this.showSizeFilter;
  }

  onSizeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);
    if (target.checked) {
      this.selectedSizes.push(value);
    } else {
      this.selectedSizes = this.selectedSizes.filter((size) => size !== value);
    }
    this.applyFilters();
  }

  onDiscountChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value);
    if (target.checked) {
      this.selectedDiscounts.push(value);
    } else {
      this.selectedDiscounts = this.selectedDiscounts.filter(
        (discount) => discount !== value
      );
    }
    this.applyFilters();
  }

  isFavorite(productId: number): boolean {
    return this.favorites.has(productId);
  }

  toggleFavorite(productId: number): void {
    if (this.favorites.has(productId)) {
      this.favorites.delete(productId);
    } else {
      this.favorites.add(productId);
    }
  }

  viewDetails(productId: number): void {
    console.log(`View details for product ${productId}`);
    this.router.navigate(['product/viewDetail/', productId]);
  }

  addToCart(productId: number): void {
    // Implement add to cart logic here
    console.log(`Add product ${productId} to cart`);
  }

  //change page

  showAddProduct = false;
  showFilter = false;
  loading = signal(false);
  searchQuery = '';
  currentPage = 1;
  pageSize = 7;
  sortDirection: 'ASC' | 'DESC' = 'ASC';
  sortColumn = 'username';
  filterActive: boolean | null = null;
  filterRole: string | null = null;

  // loadProducts() {
  //   const searchRequest: ListSearchRequest = {
  //     searchRequest: this.buildSearchRequest(),
  //     globalOperator: GlobalOperator.AND,
  //     pageDTO: {
  //       pageNo: this.currentPage - 1,
  //       pageSize: this.pageSize,
  //       sort: this.sortDirection,
  //       sortByColumn: this.sortColumn,
  //     },
  //   };

  //   this.loading.set(true);
  //   this.productService.getProductsPage(searchRequest).subscribe({
  //     next: () => {
  //       this.loading.set(false);
  //     },
  //     error: (error) => {
  //       this.loading.set(false);
  //       console.error('Error loading users:', error);
  //     },
  //   });
  // }

  // buildSearchRequest(): AttributeSearchRequest[] {
  //   const requests: AttributeSearchRequest[] = [];

  //   if (this.searchQuery) {
  //     requests.push({
  //       column: 'username',
  //       value: this.searchQuery,
  //       operation: Operation.LIKE,
  //     });
  //   }

  //   if (this.filterActive !== null) {
  //     requests.push({
  //       column: 'active',
  //       value: this.filterActive.toString(),
  //       operation: Operation.EQUAL,
  //     });
  //   }

  //   if (this.filterRole) {
  //     requests.push({
  //       column: 'id',
  //       value: this.filterRole,
  //       operation: Operation.JOIN,
  //       joinTable: 'role',
  //     });
  //   }

  //   return requests;
  // }

  // changePage(page: number) {
  //   this.currentPage = page;
  //   this.loadProducts();
  // }

  // toggleSortDirection() {
  //   this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
  //   this.loadProducts();
  // }

  // totalPages = computed(() => {
  //   console.log(this.productService.getCurrentProductSignal()()?.totalPages ?? 0);
  //   return this.productService.getCurrentProductSignal()()?.totalPages ?? 0;
  // });

  // getPageNumbers(): number[] {
  //   const total = this.totalPages();
  //   const current = this.currentPage;

  //   let start = Math.max(1, current - 2);
  //   let end = Math.min(total, start + 4);

  //   if (end === total) {
  //     start = Math.max(1, end - 4);
  //   }

  //   return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  // }

  // prevPage() {
  //   if (this.currentPage > 1) {
  //     this.changePage(this.currentPage - 1);
  //   }
  // }

  // nextPage() {
  //   if (this.currentPage < this.totalPages()) {
  //     this.changePage(this.currentPage + 1);
  //   }
  // }

  // // Kiểm tra xem có disable nút Previous không
  // canGoPrev(): boolean {
  //   return this.currentPage > 1;
  // }

  // // Kiểm tra xem có disable nút Next không
  // canGoNext(): boolean {
  //   return this.currentPage < this.totalPages();
  // }
}
