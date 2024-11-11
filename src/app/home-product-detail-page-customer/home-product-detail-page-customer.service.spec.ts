import { TestBed } from '@angular/core/testing';

import { HomeProductDetailPageCustomerService } from './home-product-detail-page-customer.service';

describe('HomeProductDetailPageCustomerService', () => {
  let service: HomeProductDetailPageCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeProductDetailPageCustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
