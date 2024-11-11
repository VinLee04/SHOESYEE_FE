import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProductPageCustomerSearchComponent } from './home-product-page-customer-search.component';

describe('HomeProductPageCustomerSearchComponent', () => {
  let component: HomeProductPageCustomerSearchComponent;
  let fixture: ComponentFixture<HomeProductPageCustomerSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProductPageCustomerSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProductPageCustomerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
