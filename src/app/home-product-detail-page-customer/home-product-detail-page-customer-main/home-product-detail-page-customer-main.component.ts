import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeProductDetailPageCustomerService } from '../home-product-detail-page-customer.service';
import { ColorOptions, ProductDetail, productInfo, SizeOptions } from '../../interface/Product';
import { API_URL_UPLOADS } from '../../../environment';
import { HomeCartPageCustomerService } from '../../home-cart-page-customer/home-cart-page-customer.service';
import { AuthService } from '../../common/service/auth.service';
// interface ProductDetail {
//   id: number;
//   name: string;
//   price: number;
//   mainImage: string;
//   images: string[];
//   colors: string[];
//   sizes: string[];
//   description: string;
//   reviewCount: number;
//   reviews: Review[];
// }

interface Review {
  id: number;
  userName: string;
  userImage: string;
  date: Date;
  text: string;
}

@Component({
  selector: 'app-home-product-detail-page-customer-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-product-detail-page-customer-main.component.html',
  styleUrl: './home-product-detail-page-customer-main.component.scss',
})
export class HomeProductDetailPageCustomerMainComponent implements OnInit {
  productId!: number;
  productDetail!: ProductDetail;
  selectedColorOption?: ColorOptions;
  selectedSizeOption?: SizeOptions;
  selectedImage?: string;

  imgHasNotUploadedYet = `${API_URL_UPLOADS}/products/default.png`;
  imgHasNotUploadedYetThumbnail = `${API_URL_UPLOADS}/products/default.png`;

  constructor(
    private route: ActivatedRoute,
    private productDetailService: HomeProductDetailPageCustomerService,
    private cartService: HomeCartPageCustomerService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.productId = Number(params.get('id'));
      this.loadProductDetail();
    });
  }

  loadProductDetail(): void {
    this.productDetailService
      .getCurrentProductDetail(this.productId)
      .subscribe({
        next: (response: ProductDetail) => {
          this.productDetail = response;
          if (this.productDetail.colorOptions.length > 0) {
            this.selectColor(this.productDetail.colorOptions[0]);
          }
        },
        error: (error) => {
          console.error('Error loading product details:', error);
          // Handle error appropriately
        },
      });
  }
  auth = inject(AuthService);

  selectColor(color: ColorOptions): void {
    this.selectedColorOption = color;
    this.selectedSizeOption = undefined;
    this.selectedImage =
      `${API_URL_UPLOADS}/product-images/${color.image}` ||
      `${API_URL_UPLOADS}/product-images/default.png`;
    this.auth.scrollToTop();
  }

  getImage(image: string) {
    return `${
      image
        ? `${API_URL_UPLOADS}/product-images/${image}`
        : `${API_URL_UPLOADS}/product-images/default.png`
    }`;
  }

  selectSize(sizeOption: SizeOptions): void {
    if (sizeOption.isActive && sizeOption.quantity > 0) {
      this.selectedSizeOption = sizeOption;
    }
  }

  getDisplayPrice(): string {
    const price =
      this.selectedSizeOption?.price || this.productDetail.productInfo.price;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }

  addToCart(): void {
    if (!this.selectedColorOption || !this.selectedSizeOption) {
      alert('Please select both color and size');
      return;
    }

    this.cartService
      .addToCart(this.selectedSizeOption.productDetailColorsId, 1)
      .subscribe();
    console.log('Adding to cart:', {
      selectedProductDetailColorId:
        this.selectedSizeOption.productDetailColorsId,
      productId: this.productDetail.productInfo.id,
      color: this.selectedColorOption.colorName,
      size: this.selectedSizeOption.size,
      price: this.selectedSizeOption.price,
    });
  }
}