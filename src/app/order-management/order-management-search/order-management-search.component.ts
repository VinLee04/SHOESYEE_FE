import { Component, ElementRef, output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-management-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './order-management-search.component.html',
  styleUrl: './order-management-search.component.scss',
})
export class OrderManagementSearchComponent {
  searchTermChange = output<string>();
  searchValue = '';
  
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  updateSearchValue(value: string): void {
    this.searchValue = value;
  }

  handleSearch(): void {
    this.searchInput.nativeElement.blur();
    this.searchTermChange.emit(this.searchValue.trim());
  }
}