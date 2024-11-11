import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductManagementFilterComponent } from './product-management-filter.component';

describe('ProductManagementFilterComponent', () => {
  let component: ProductManagementFilterComponent;
  let fixture: ComponentFixture<ProductManagementFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductManagementFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductManagementFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
