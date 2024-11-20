import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderManagementSearchComponent } from './order-management-search.component';

describe('OrderManagementSearchComponent', () => {
  let component: OrderManagementSearchComponent;
  let fixture: ComponentFixture<OrderManagementSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderManagementSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderManagementSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
