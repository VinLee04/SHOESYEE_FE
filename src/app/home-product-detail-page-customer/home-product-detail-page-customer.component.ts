import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeProductDetailPageCustomerMainComponent } from './home-product-detail-page-customer-main/home-product-detail-page-customer-main.component';
import { HomeProductDetailPageCustomerReviewDetailComponent } from './home-product-detail-page-customer-review-detail/home-product-detail-page-customer-review-detail.component';
import { HomeProductDetailPageCustomerRelatedDetailComponent } from './home-product-detail-page-customer-related-detail/home-product-detail-page-customer-related-detail.component';
import { AuthService } from '../common/service/auth.service';


@Component({
  selector: 'app-home-product-detail-page-customer',
  standalone: true,
  imports: [CommonModule, HomeProductDetailPageCustomerMainComponent, HomeProductDetailPageCustomerReviewDetailComponent, HomeProductDetailPageCustomerRelatedDetailComponent],
  templateUrl: './home-product-detail-page-customer.component.html',
  styleUrl: './home-product-detail-page-customer.component.scss'
})
export class HomeProductDetailPageCustomerComponent implements OnInit{

  auth = inject(AuthService);

  ngOnInit(): void {
    this.auth.scrollToTop();    
  }
}