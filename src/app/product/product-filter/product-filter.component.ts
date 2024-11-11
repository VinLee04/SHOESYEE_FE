import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface FilterState {
  brand: string;
  color: string;
  category: string;
  sizes: string[];
  minPrice: number;
  maxPrice: number;
  discounts: string[];
  sortOrder: 'asc' | 'desc';
}

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.scss',
})
export class ProductFilterComponent {
  @Input() brands: string[] = [];
  @Input() colors: string[] = [];
  @Input() categories: string[] = [];
  @Input() sizes: string[] = [];
  @Input() discounts: string[] = [];

  @Output() filterChange = new EventEmitter<FilterState>();

  showSizeFilter = false;

  filters: FilterState = {
    brand: '',
    color: '',
    category: '',
    sizes: [],
    minPrice: 0,
    maxPrice: 0,
    discounts: [],
    sortOrder: 'asc',
  };

  toggleSizeFilter() {
    this.showSizeFilter = !this.showSizeFilter;
  }

  onSizeChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.filters.sizes.push(checkbox.value);
    } else {
      this.filters.sizes = this.filters.sizes.filter(
        (size) => size !== checkbox.value
      );
    }
    this.applyFilters();
  }

  onDiscountChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.filters.discounts.push(checkbox.value);
    } else {
      this.filters.discounts = this.filters.discounts.filter(
        (discount) => discount !== checkbox.value
      );
    }
    this.applyFilters();
  }

  setSortOrder(order: 'asc' | 'desc') {
    this.filters.sortOrder = order;
    this.applyFilters();
  }

  clearFilters() {
    this.filters = {
      brand: '',
      color: '',
      category: '',
      sizes: [],
      minPrice: 0,
      maxPrice: 0,
      discounts: [],
      sortOrder: 'asc',
    };
    this.applyFilters();
  }

  applyFilters() {
    this.filterChange.emit(this.filters);
  }
}
