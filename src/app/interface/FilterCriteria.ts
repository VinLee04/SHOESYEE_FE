export interface FilterCriteria {
  searchTerm?: string;
  color?: string;
  category?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  sortOrder?: 'asc' | 'desc';
  page: number;
  itemsPerPage: number;
}
