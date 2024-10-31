import { Component, computed, input, model, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../pagination/pagination.component';
import { tableColumns } from '../../interface/Table';
import { API_URL_UPLOADS, environment } from '../../../environment';

@Component({
  selector: 'app-management-table',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './management-table.component.html',
  styleUrl: './management-table.component.scss',
})
export class ManagementTableComponent {
  // searchQuery = model<string>('');
  currentPage = model<number>(1);
  sortColumn = model<string>('');
  sortDirection = model<'ASC' | 'DESC'>('ASC');
  url = API_URL_UPLOADS;

  data = input.required<any[]>();
  columns = input.required<tableColumns[]>();
  showActions = input<boolean>(true);
  trackBy = input<(item: any) => any>((item) => item.id);

  edit = output<any>();
  delete = output<any>();
  restore = output<any>();
  sort = output<{ column: string; direction: 'ASC' | 'DESC' }>();

  onSort(column: string) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'ASC' ? 'DESC' : 'ASC');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('ASC');
    }
    this.sort.emit({ column, direction: this.sortDirection() });
  }

  onEdit(item: any) {
    this.edit.emit(item);
  }

  onDelete(item: any) {
    this.delete.emit(item);
  }

  onRestore(item: any) {
    this.restore.emit(item);
  }

  // filteredData = computed(() => {
  //   let filtered = [...this.data()];

  // if (this.searchQuery()) {
  //   const query = this.searchQuery().toLowerCase();
  //   filtered = filtered.filter((item) =>
  //     this.columns().some((column) =>
  //       String(item[column.key]).toLowerCase().includes(query)
  //     )
  //   );
  // }

  //   return filtered;
  // });

  // itemsPerPage = input<number>(7);
  // paginatedData = computed(() => {
  //   const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
  //   const endIndex = startIndex + this.itemsPerPage();
  //   alert(startIndex + " - " + endIndex);
  //   alert(this.filteredData().slice(startIndex, endIndex).length);
  //   return this.filteredData().slice(startIndex, endIndex);
  // });
}