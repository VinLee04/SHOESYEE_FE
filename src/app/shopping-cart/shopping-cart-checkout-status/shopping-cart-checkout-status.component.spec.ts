import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartCheckoutStatusComponent } from './shopping-cart-checkout-status.component';

describe('ShoppingCartCheckoutStatusComponent', () => {
  let component: ShoppingCartCheckoutStatusComponent;
  let fixture: ComponentFixture<ShoppingCartCheckoutStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingCartCheckoutStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingCartCheckoutStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
