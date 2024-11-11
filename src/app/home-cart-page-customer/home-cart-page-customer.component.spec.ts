import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCartPageCustomerComponent } from './home-cart-page-customer.component';

describe('HomeCartPageCustomerComponent', () => {
  let component: HomeCartPageCustomerComponent;
  let fixture: ComponentFixture<HomeCartPageCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCartPageCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCartPageCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
