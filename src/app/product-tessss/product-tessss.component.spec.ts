import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTessssComponent } from './product-tessss.component';

describe('ProductTessssComponent', () => {
  let component: ProductTessssComponent;
  let fixture: ComponentFixture<ProductTessssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTessssComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductTessssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
