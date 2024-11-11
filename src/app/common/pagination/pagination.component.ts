import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  totalPages = input.required<number>();
  currentPage = input.required<number>();

  pageChange = output<number>();

  private readonly PAGE_COUNT = 5;

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    let start: number;
    let end: number;

    if (total <= this.PAGE_COUNT) {
      start = 1;
      end = total;
    } else if (current > total - this.PAGE_COUNT + 2) {
      start = total - this.PAGE_COUNT + 1;
      end = total;
    } else {
      start =
        current <= Math.ceil(this.PAGE_COUNT / 2)
          ? 1
          : current - Math.floor(this.PAGE_COUNT / 2);
      end = start + this.PAGE_COUNT - 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  goToPage(page: number): void {
    if (page !== this.currentPage()) {
      console.log("object" + page);
      this.pageChange.emit(page);
    }
  }

  prevPage(): void {
    if (this.canGoPrev()) {
      console.log('object', this.currentPage() - 1);
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.canGoNext()) {
            console.log('object', this.currentPage() + 1);
      this.pageChange.emit(this.currentPage() + 1);
    }
  }

  canGoPrev = computed(() => this.currentPage() > 1);
  canGoNext = computed(() => this.currentPage() < this.totalPages());
}