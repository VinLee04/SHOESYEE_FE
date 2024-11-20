import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrderStatus } from '../../../interface/Order';

@Component({
  selector: 'app-customer-feature-order-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './customer-feature-order-nav.component.html',
  styleUrl: './customer-feature-order-nav.component.scss',
})
export class CustomerFeatureOrderNavComponent {
  OrderStatus = OrderStatus;
}
