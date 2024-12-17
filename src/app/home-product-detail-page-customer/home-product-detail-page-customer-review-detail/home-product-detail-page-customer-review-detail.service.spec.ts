import { TestBed } from '@angular/core/testing';
import { HomeProductDetailPageCustomerReviewDetailService } from './home-product-detail-page-customer-review-detail.service';


describe('HomeProductDetailPageCustomerReviewDetailService', () => {
  let service: HomeProductDetailPageCustomerReviewDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeProductDetailPageCustomerReviewDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
