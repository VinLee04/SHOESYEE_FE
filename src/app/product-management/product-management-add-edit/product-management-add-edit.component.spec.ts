import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductManagementAddEditComponent } from './product-management-add-edit.component';

describe('ProductManagementAddEditComponent', () => {
  let component: ProductManagementAddEditComponent;
  let fixture: ComponentFixture<ProductManagementAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductManagementAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductManagementAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
