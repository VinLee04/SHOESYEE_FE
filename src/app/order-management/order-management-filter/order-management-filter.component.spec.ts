import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderManagementFilterComponent } from './order-management-filter.component';

describe('OrderManagementFilterComponent', () => {
  let component: OrderManagementFilterComponent;
  let fixture: ComponentFixture<OrderManagementFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderManagementFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderManagementFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
