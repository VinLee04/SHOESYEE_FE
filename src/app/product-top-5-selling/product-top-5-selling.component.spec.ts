import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTop5SellingComponent } from './product-top-5-selling.component';

describe('ProductTop5SellingComponent', () => {
  let component: ProductTop5SellingComponent;
  let fixture: ComponentFixture<ProductTop5SellingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTop5SellingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductTop5SellingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
