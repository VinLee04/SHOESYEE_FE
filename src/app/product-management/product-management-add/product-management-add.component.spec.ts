import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductManagementAddComponent } from './product-management-add.component';

describe('ProductManagementAddComponent', () => {
  let component: ProductManagementAddComponent;
  let fixture: ComponentFixture<ProductManagementAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductManagementAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductManagementAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
