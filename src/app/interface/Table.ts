export interface tableColumns {
  key: string;
  title: string;
  class?: string;
  sortable: boolean;
}


export interface PageManagement<T> {
  ItemsManagementPage: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface SortEvent {
  column: string;
  direction: 'ASC' | 'DESC';
}

export interface UsersManagementTable {
  id: string;
  username: string;
  email: string;
  role: { id: string; description: string };
  address: string;
  salary: number;
  active: boolean;
  gender: boolean;
  image: string;
  phone: string;
  birthdate: Date;
  lastActive?: Date;
  dateAdded?: Date;
}

