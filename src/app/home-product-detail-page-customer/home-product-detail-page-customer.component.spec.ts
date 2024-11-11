import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProductDetailPageCustomerComponent } from './home-product-detail-page-customer.component';

describe('HomeProductDetailPageCustomerComponent', () => {
  let component: HomeProductDetailPageCustomerComponent;
  let fixture: ComponentFixture<HomeProductDetailPageCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProductDetailPageCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProductDetailPageCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
