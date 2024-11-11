import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFeaturesComponent } from './customer-features.component';

describe('CustomerFeaturesComponent', () => {
  let component: CustomerFeaturesComponent;
  let fixture: ComponentFixture<CustomerFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerFeaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
