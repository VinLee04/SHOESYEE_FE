export interface ProductOptionDetail {
  id: number;
  size: number;
  price: number;
  quantity: number;
}

export interface ProductOption {
  details: ProductOptionDetail[];
  image: string;
  color: string;
}

export interface CustomerProductResponse {
  id: number;
  name: string;
  brandName: string;
  thumbnail: string;
  categoryName: string;
  price: number;
  discountPercent: number;
  description: string;
}

export interface CustomerProductDetailResponse {
  product: CustomerProductResponse;
  options: ProductOption[];
}
