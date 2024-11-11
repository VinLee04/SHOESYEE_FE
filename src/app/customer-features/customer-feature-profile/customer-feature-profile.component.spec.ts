import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFeatureProfileComponent } from './customer-feature-profile.component';

describe('CustomerFeatureProfileComponent', () => {
  let component: CustomerFeatureProfileComponent;
  let fixture: ComponentFixture<CustomerFeatureProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerFeatureProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerFeatureProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
