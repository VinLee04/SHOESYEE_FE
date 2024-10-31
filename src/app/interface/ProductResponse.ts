import { Product } from "./Product";

export interface ProductResponse {
  products: Product[];
  totalItems: number;
}
