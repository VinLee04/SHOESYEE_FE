import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFeatureOrderListComponent } from './customer-feature-order-list.component';

describe('CustomerFeatureOrderListComponent', () => {
  let component: CustomerFeatureOrderListComponent;
  let fixture: ComponentFixture<CustomerFeatureOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerFeatureOrderListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerFeatureOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
