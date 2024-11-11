import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProductPageCustomerListComponent } from './home-product-page-customer-list.component';

describe('HomeProductPageCustomerListComponent', () => {
  let component: HomeProductPageCustomerListComponent;
  let fixture: ComponentFixture<HomeProductPageCustomerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProductPageCustomerListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProductPageCustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
