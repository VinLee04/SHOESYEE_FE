import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomerFeatureOrderNavComponent } from './customer-feature-order-nav/customer-feature-order-nav.component';
import { CustomerFeatureOrderListComponent } from './customer-feature-order-list/customer-feature-order-list.component';
import { PaginationComponent } from '../../common/pagination/pagination.component';

@Component({
  selector: 'app-customer-feature-order',
  standalone: true,
  imports: [
    RouterModule,
    CustomerFeatureOrderListComponent,
    CustomerFeatureOrderNavComponent,
    PaginationComponent,
  ],
  templateUrl: './customer-feature-order.component.html',
  styleUrl: './customer-feature-order.component.scss',
})
export class CustomerFeatureOrderComponent {
  currentPage = signal<number>(1);
  totalPages = 20;
}
