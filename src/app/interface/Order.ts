import { UserInfo } from "./User";

export interface OrderResponseFull {
  orderId: number;
  user: UserInfo | null;
  orderDate: string;
  shippedDate: string;
  status: string;
  totalAmount: number;
  note: string;
  paymentMethodId: number;
  paymentDate: Date | null;
  paymentStatus: string;
  districtId: number;
  serviceTypeId: number;
  transportName: string;
  customerName: string;
  phone: string;
  wardCode: string;
  shipAddress: string;
  orderDetails: OrderDetailResponse[];
}

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

export enum OrderStatus {
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

export enum OrderStatusRequest {
  WAITING_FOR_CONFIRMATION = 'WAITING_FOR_CONFIRMATION', 
  WAITING_FOR_GOODS = 'WAITING_FOR_GOODS',  
  WAITING_FOR_SHIPPING = 'WAITING_FOR_SHIPPING',
  DELIVERED = 'DELIVERED', 
  CANCELED = 'CANCELED',  
  RETURNED = 'RETURNED',  
}