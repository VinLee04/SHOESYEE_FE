import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss',
})
export class ProductSearchComponent {
  searchTerm = '';

  search = output<string>();
  clear = output<void>();
  clearAll = output<void>();

  onSearch(event: Event) {
    // Lấy giá trị đã loại bỏ khoảng trắng ở đầu và cuối
    const trimmedSearchTerm = this.searchTerm.trim();

    // Kiểm tra nếu ký tự không phải là khoảng trắng hoặc là ký tự hợp lệ
    if (trimmedSearchTerm.length > 0 || event instanceof KeyboardEvent && event.key !== ' ') {
      // Nếu nhập vào ký tự không phải là khoảng trắng, phát sự kiện emit
      this.search.emit(trimmedSearchTerm);
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.clear.emit();
  }

  clearAllP() {
    this.clearAll.emit();
  }
}
