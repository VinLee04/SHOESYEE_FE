import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../home-product-page-customer-filter/home-product-page-customer-fiter.service';

@Component({
  selector: 'app-home-product-page-customer-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home-product-page-customer-search.component.html',
  styleUrl: './home-product-page-customer-search.component.scss',
})
export class HomeProductPageCustomerSearchComponent {
  searchTerm: string = '';
  showFilter = inject(FilterService).showFilter;

  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  constructor(private filterService: FilterService) {}

  toggleFilter() {
    this.filterService.toggleFilter();
  }
  onSearchChange() {
    // Gọi sự kiện mỗi khi tìm kiếm thay đổi
    this.search.emit(this.searchTerm);
  }

  onKeyUp(event: KeyboardEvent) {
    // Kiểm tra nếu phím được nhấn là Enter
    if (event.key === 'Enter') {
      this.search.emit(this.searchTerm);
    }
  }

  clearSearch() {}

  clearAll() {}
}
