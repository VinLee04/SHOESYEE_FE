import { TestBed } from '@angular/core/testing';

import { HomeProductPageCustomerService } from './home-product-page-customer.service';

describe('HomeProductPageCustomerService', () => {
  let service: HomeProductPageCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeProductPageCustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
