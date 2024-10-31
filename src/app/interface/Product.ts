// src/app/interface/Product.ts

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  type: string;
  colors: string[];
  sizes: number[];
  price: number;
  discountPercentage: number;
  image: string;
}

export interface FilterCriteria {
  searchTerm: string;
  brand: string;
  color: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  discounts: number[] | null;
  sizes: number[];
  sortOrder: 'asc' | 'desc';
  page: number;
  itemsPerPage: number;
}

export interface ProductResponse {
  products: Product[];
  totalItems: number;
}



export interface ProductsManagement {
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

export interface ProductsPageManagement {
  usersManagementPage: ProductsManagement[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}