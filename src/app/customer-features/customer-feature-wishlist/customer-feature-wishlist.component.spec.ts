import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFeatureWishlistComponent } from './customer-feature-wishlist.component';

describe('CustomerFeatureWishlistComponent', () => {
  let component: CustomerFeatureWishlistComponent;
  let fixture: ComponentFixture<CustomerFeatureWishlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerFeatureWishlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerFeatureWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
