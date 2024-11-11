import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductManagementSearchComponent } from './product-management-search.component';

describe('ProductManagementSearchComponent', () => {
  let component: ProductManagementSearchComponent;
  let fixture: ComponentFixture<ProductManagementSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductManagementSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductManagementSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
