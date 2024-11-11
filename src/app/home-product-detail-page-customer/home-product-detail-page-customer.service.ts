import { Injectable, signal } from '@angular/core';
import { BaseService } from '../common/service/base.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../notification/notification.service';
import { ProductDetail } from '../interface/Product';
import { map, Observable } from 'rxjs';
import { ApiResponse, DataResponse } from '../interface/ApiResponse';
import { API_URL_PRODUCT_DETAILS } from '../../environment';

interface CartItem {
  productDetailColorsId: number; 
  productId: number; 
  quantity: number; 
  selectedSize: number; 
  selectedColor: string; 
}

@Injectable({
  providedIn: 'root',
})
export class HomeProductDetailPageCustomerService extends BaseService {
  private currentProductDetailSignal = signal<ProductDetail | undefined>(
    undefined
  );

  constructor(
    private http: HttpClient,
    notificationService: NotificationService
  ) {
    super(notificationService);
  }

  getCurrentProductDetailSignal() {
    return this.currentProductDetailSignal;
  }

  getCurrentProductDetail(productId: number): Observable<ProductDetail> {
    return this.http
      .get<ApiResponse>(`${API_URL_PRODUCT_DETAILS}/${productId}`)
      .pipe(
        map((response: ApiResponse) => {
          const productDetail =
            this.handleResponse<ProductDetail>(response).result;
          this.currentProductDetailSignal.set(productDetail);
          return productDetail;
        })
      );
  }

  addToCart(productDetailColorsId: number) {
    // var cart:Cart | null = localStorage.getItem("cart");
    // if(cart){
    //   cart.
    // }
    // localStorage.setItem('productDetailColorsId', productDetailColorsId+'');
  }
}
