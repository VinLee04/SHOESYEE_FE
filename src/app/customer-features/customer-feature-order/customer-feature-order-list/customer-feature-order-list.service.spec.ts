import { TestBed } from '@angular/core/testing';

import { CustomerFeatureOrderListService } from './customer-feature-order-list.service';

describe('CustomerFeatureOrderListService', () => {
  let service: CustomerFeatureOrderListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerFeatureOrderListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
