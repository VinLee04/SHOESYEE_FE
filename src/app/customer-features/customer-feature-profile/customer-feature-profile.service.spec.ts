import { TestBed } from '@angular/core/testing';

import { CustomerFeatureProfileService } from './customer-feature-profile.service';

describe('CustomerFeatureProfileService', () => {
  let service: CustomerFeatureProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerFeatureProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
