import { Component } from '@angular/core';
import { CustomerFeatureNavComponent } from './customer-feature-nav/customer-feature-nav.component';
import { CustomerFeatureWishlistComponent } from './customer-feature-wishlist/customer-feature-wishlist.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-features',
  standalone: true,
  imports: [RouterModule ,CustomerFeatureWishlistComponent, CustomerFeatureNavComponent],
  templateUrl: './customer-features.component.html',
  styleUrl: './customer-features.component.scss'
})
export class CustomerFeaturesComponent {

}
