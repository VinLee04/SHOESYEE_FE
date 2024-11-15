import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AttributeSearchRequest,
  GlobalOperator,
  ListSearchRequest,
  Operation,
} from '../interface/PageRequest';
import { SortEvent, tableColumns } from '../interface/Table';
import { UserService } from './user.service';
import { UserManagementFilterComponent } from './user-management-filter/user-management-filter.component';
import { ManagementTableComponent } from '../common/management-table/management-table.component';
import { PaginationComponent } from '../common/pagination/pagination.component';
import { UserManagementAddEditComponent } from './user-management-add-edit/user-management-add-edit.component';
import { UserManagementFilterValues } from '../interface/filterMangementTable';
import { FilterService } from '../home-product-page-customer/home-product-page-customer-filter/home-product-page-customer-fiter.service';
import { NavService } from '../management-navbar/nav.service';


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserManagementAddEditComponent,
    UserManagementFilterComponent,
    ManagementTableComponent,
    PaginationComponent,
  ],
})
export class UserManagementComponent {
  @ViewChild(UserManagementFilterComponent)
  private readonly filterComponent!: UserManagementFilterComponent;

  private readonly PAGE_SIZE = 7;
  private readonly COLUMN_MAP: Record<string, string> = {
    userInfo: 'username',
    genderDisplay: 'gender',
    statusDisplay: 'active',
    roleDisplay: 'role',
  };

  navService = inject(NavService);

  readonly currentPage = signal(1);
  readonly loading = signal(false);

  readonly totalPages = computed(
    () => this.userService.getCurrentUserPageSignal()()?.totalPages ?? 0
  );
  readonly totalElements = computed(
    () => this.userService.getCurrentUserPageSignal()()?.totalElements ?? 0
  );
  readonly users = computed(() =>
    this.mapUserData(this.userService.getCurrentUserPageSignal()())
  );

  tableColumns: tableColumns[];
  filterValues: UserManagementFilterValues = { status: true };
  searchQuery = '';
  sortDirection: 'ASC' | 'DESC' = 'ASC';
  sortColumn = 'username';
  showAddUser = false;
  showFilter = false;
  isEditMode = false;
  editModeData: any | null;

  constructor(private readonly userService: UserService) {
    effect(
      () => {
        this.loadPageData(this.currentPage());
      },
      { allowSignalWrites: true }
    );

    this.filterValues = this.userService.filterValues;
    this.tableColumns = this.userService.tableColumns;
  }

  handlePageChange(page: number): void {
    this.currentPage.set(page);
  }

  handleSort(event: SortEvent): void {
    this.sortColumn = this.COLUMN_MAP[event.column] || event.column;
    this.sortDirection = event.direction;
    this.loadPageData(this.currentPage());
  }

  handleSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.resetAndLoad();
  }

  handleFilterApplied(filterValues: Partial<UserManagementFilterValues>): void {
    this.filterValues = this.normalizeFilterValues(filterValues);
    this.resetAndLoad();
  }

  handleClean(): void {
    this.searchQuery = '';
    this.filterComponent?.clearFilter();
    this.filterValues = { status: true };
    this.loadPageData(this.currentPage());
  }

  handleDelete(user: any): void {
    this.userService
      .deleteUser(user.id)
      .subscribe(() => this.loadPageData(this.currentPage()));
  }

  close = inject(FilterService);
  handleAdd(): void {
    this.navService.navSignal.set(false);
    this.isEditMode = false;
    this.editModeData = null;
    this.showAddUser = true;
  }

  handleFilter(): void{
    this.navService.navSignal.set(false);
    this.showFilter = true;
  }

  handleEdit(user: any): void {
    this.navService.navSignal.set(false);
    this.isEditMode = true;
    this.editModeData = user;
    this.showAddUser = true;
  }

  handleRestore(user: any): void {
    this.userService
      .restoreUser(user.id)
      .subscribe(() => this.loadPageData(this.currentPage()));
  }

  private resetAndLoad(): void {
    this.currentPage.set(1);
    this.loadPageData(1);
  }

  private loadPageData(page: number): void {
    const request = this.buildSearchRequest(page);

    this.loading.set(true);
    this.userService.getUsersPage(request).subscribe({
      next: () => this.loading.set(false),
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  private buildSearchRequest(page: number): ListSearchRequest {
    return {
      searchRequest: this.buildAttributeSearchRequests(),
      globalOperator: GlobalOperator.AND,
      pageDTO: {
        pageNo: page - 1,
        pageSize: this.PAGE_SIZE,
        sort: this.sortDirection,
        sortByColumn: this.sortColumn,
      },
    };
  }

  private buildAttributeSearchRequests(): AttributeSearchRequest[] {
    const requests: AttributeSearchRequest[] = [];

    if (this.searchQuery?.trim()) {
      requests.push(
        this.createSearchRequest('username', this.searchQuery, Operation.LIKE)
      );
    }

    const filterMappings: Record<
      keyof UserManagementFilterValues,
      { column: string; operation: Operation }
    > = {
      email: { column: 'email', operation: Operation.LIKE },
      phone: { column: 'phone', operation: Operation.LIKE },
      role: { column: 'id', operation: Operation.JOIN },
      gender: { column: 'gender', operation: Operation.EQUAL },
      status: { column: 'isActive', operation: Operation.EQUAL },
    };

    Object.entries(this.filterValues).forEach(([key, value]) => {
      if (this.isValidFilterValue(value)) {
        const mapping = filterMappings[key as keyof UserManagementFilterValues];
        requests.push(
          this.createSearchRequest(
            mapping.column,
            value,
            mapping.operation,
            key === 'role' ? 'role' : undefined
          )
        );
      }
    });

    return requests;
  }

  private isValidFilterValue(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && !value.trim()) return false;
    if (typeof value === 'boolean') return true;
    return true;
  }

  private createSearchRequest(
    column: string,
    value: any,
    operation: Operation,
    joinTable?: string
  ): AttributeSearchRequest {
    return { column, value, operation, ...(joinTable && { joinTable }) };
  }

  private normalizeFilterValues(
    values: Partial<UserManagementFilterValues>
  ): UserManagementFilterValues {
    return {
      ...values,
      gender: this.parseBoolean(values.gender),
      status: this.parseBoolean(values.status),
    };
  }

  private parseBoolean(value: any): boolean | null {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return null;
  }

  private mapUserData(data: any): any[] {
    return (
      data?.ItemsManagementPage.map((user: any) => ({
        ...user,
        salary: user.salary || 'not updated yet',
        gender: user.gender ? 'Male' : 'FeMale',
        status: user.active ? 'Active' : 'InActive',
        userInfo: {
          image: user.image,
          name: user.username,
          email: user.email,
        },
        role: user.role.id,
      })) ?? []
    );
  }
}
