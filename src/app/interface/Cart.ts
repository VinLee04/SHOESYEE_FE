export interface OrderDetail {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderResponse {
  shippedDate: Date;
  totalAmount: number;
  note: string;
  paymentDate: Date;
  paymentStatus: string;
  transportName: string;
  customerName: string;
  phone: string;
  orderDetails: OrderDetail[];
}
// models/order.model.ts
export interface OrderDetailResponse {
  orderDetailId: number;
  productDetailColorsId: number;
  productDetailName: string;
  price: number;
  discountPercent: number;
  color: string;
  image: string;
  totalPrice: number;
  isProductDetailActive: boolean;
  quantity: number;
  size: number;
}

export interface OrderResponseStatus {
  shippedDate: string | null;
  totalAmount: number;
  note: string | null;
  paymentDate: Date | null;
  paymentStatus: string;
  transportName: string;
  customerName: string;
  phone: string;
  orderDetails: OrderDetailResponse[];
}