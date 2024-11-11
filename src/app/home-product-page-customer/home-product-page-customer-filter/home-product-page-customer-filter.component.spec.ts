import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProductPageCustomerFilterComponent } from './home-product-page-customer-filter.component';

describe('HomeProductPageCustomerFilterComponent', () => {
  let component: HomeProductPageCustomerFilterComponent;
  let fixture: ComponentFixture<HomeProductPageCustomerFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProductPageCustomerFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProductPageCustomerFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
