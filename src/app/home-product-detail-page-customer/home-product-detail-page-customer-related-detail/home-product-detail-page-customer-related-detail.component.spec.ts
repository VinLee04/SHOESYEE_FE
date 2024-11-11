import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProductDetailPageCustomerRelatedDetailComponent } from './home-product-detail-page-customer-related-detail.component';

describe('HomeProductDetailPageCustomerRelatedDetailComponent', () => {
  let component: HomeProductDetailPageCustomerRelatedDetailComponent;
  let fixture: ComponentFixture<HomeProductDetailPageCustomerRelatedDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProductDetailPageCustomerRelatedDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProductDetailPageCustomerRelatedDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
