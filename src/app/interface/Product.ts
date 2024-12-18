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



// export interface ProductsManagement {
//   id: string;
//   username: string;
//   email: string;
//   role: { id: string; description: string };
//   address: string;
//   salary: number;
//   active: boolean;
//   gender: boolean;
//   image: string;
//   phone: string;
//   birthdate: Date;
//   lastActive?: Date;
//   dateAdded?: Date;
// }

// export interface ProductsPageManagement {
//   usersManagementPage: ProductsManagement[];
//   totalElements: number;
//   totalPages: number;
//   currentPage: number;
//   pageSize: number;
// }

export interface ProductShowForUser {
  id: number;
  thumbnail: string | null;
  name: string;
  price: number;
  colors: string[];
  brandName: string;
  categoryName: string;
  discountPercent: number | null;
}
export interface ProductTable {
  id: string;
  name: string;
  categoryName: string;
  brandName: string;
  color: string[];
  status: string;
  thumbnail: string;
  price: number;
  discountPercent?: number,
  stock: number;
  description: string;
  isActive: boolean;
}

export interface productInfo {
  id: number;
  thumbnail: string | null;
  name: string;
  price: number;
  colors: string[];
  brandName: string;
  categoryName: string;
  discountPercent: number | null;
  liked: boolean;
}

export interface ColorOptions {
  colorName: string;
  image: string;
  sizeOptions: SizeOptions[];
}

export interface SizeOptions {
  productDetailColorsId: number;
  size: number;
  price: number;
  quantity: number;
  isActive: boolean;
}

export interface ProductDetail {
  productInfo: productInfo;
  colorOptions: ColorOptions[];
}

export enum ORDER_STATUS {
  PENDING = 'PENDING',
  WAITING_FOR_CONFIRMATION = 'WAITING_FOR_CONFIRMATION',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
  RETURNED = 'RETURNED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}