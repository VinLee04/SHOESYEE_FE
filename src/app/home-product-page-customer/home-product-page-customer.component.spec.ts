import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProductPageCustomerComponent } from './home-product-page-customer.component';

describe('HomeProductPageCustomerComponent', () => {
  let component: HomeProductPageCustomerComponent;
  let fixture: ComponentFixture<HomeProductPageCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProductPageCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProductPageCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
