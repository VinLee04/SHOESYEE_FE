import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFeatureOrderNavComponent } from './customer-feature-order-nav.component';

describe('CustomerFeatureOrderNavComponent', () => {
  let component: CustomerFeatureOrderNavComponent;
  let fixture: ComponentFixture<CustomerFeatureOrderNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerFeatureOrderNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerFeatureOrderNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
