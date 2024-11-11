import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFeatureNavComponent } from './customer-feature-nav.component';

describe('CustomerFeatureNavComponent', () => {
  let component: CustomerFeatureNavComponent;
  let fixture: ComponentFixture<CustomerFeatureNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerFeatureNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerFeatureNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
