import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProductDetailPageCustomerReviewDetailComponent } from './home-product-detail-page-customer-review-detail.component';

describe('HomeProductDetailPageCustomerReviewDetailComponent', () => {
  let component: HomeProductDetailPageCustomerReviewDetailComponent;
  let fixture: ComponentFixture<HomeProductDetailPageCustomerReviewDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProductDetailPageCustomerReviewDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProductDetailPageCustomerReviewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
