import { TestBed } from '@angular/core/testing';

import { ProductManagementAddEditService } from './product-management-add-edit.service';

describe('ProductManagementAddEditService', () => {
  let service: ProductManagementAddEditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductManagementAddEditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
