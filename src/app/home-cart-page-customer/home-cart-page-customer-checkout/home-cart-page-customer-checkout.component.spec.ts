import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCartPageCustomerCheckoutComponent } from './home-cart-page-customer-checkout.component';

describe('HomeCartPageCustomerCheckoutComponent', () => {
  let component: HomeCartPageCustomerCheckoutComponent;
  let fixture: ComponentFixture<HomeCartPageCustomerCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCartPageCustomerCheckoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCartPageCustomerCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
