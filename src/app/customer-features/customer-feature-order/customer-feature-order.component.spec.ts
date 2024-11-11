import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFeatureOrderComponent } from './customer-feature-order.component';

describe('CustomerFeatureOrderComponent', () => {
  let component: CustomerFeatureOrderComponent;
  let fixture: ComponentFixture<CustomerFeatureOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerFeatureOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerFeatureOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
