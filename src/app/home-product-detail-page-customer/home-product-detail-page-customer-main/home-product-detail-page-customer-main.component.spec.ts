import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProductDetailPageCustomerMainComponent } from './home-product-detail-page-customer-main.component';

describe('HomeProductDetailPageCustomerMainComponent', () => {
  let component: HomeProductDetailPageCustomerMainComponent;
  let fixture: ComponentFixture<HomeProductDetailPageCustomerMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProductDetailPageCustomerMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProductDetailPageCustomerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
