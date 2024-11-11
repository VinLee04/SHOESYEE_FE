import { TestBed } from '@angular/core/testing';

import { CustomerFeatureWishlistService } from './customer-feature-wishlist.service';

describe('CustomerFeatureWishlistService', () => {
  let service: CustomerFeatureWishlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerFeatureWishlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
