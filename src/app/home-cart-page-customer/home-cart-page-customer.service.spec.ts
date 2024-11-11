import { TestBed } from '@angular/core/testing';

import { HomeCartPageCustomerService } from './home-cart-page-customer.service';

describe('HomeCartPageCustomerService', () => {
  let service: HomeCartPageCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeCartPageCustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
