import { Component, input } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { ORDER_STATUS } from '../../../interface/Product';

@Component({
  selector: 'app-customer-feature-order-list',
  standalone: true,
  imports: [],
  templateUrl: './customer-feature-order-list.component.html',
  styleUrl: './customer-feature-order-list.component.scss',
})
export class CustomerFeatureOrderListComponent {
  constructor(private route: ActivatedRoute) {}
  status: string = '';

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const status = params['status'];
      if (status) {
        if(status==ORDER_STATUS.WAITING_FOR_CONFIRMATION){
          this.status = "WAITING";
        }
        else{
          this.status = status;
        }
      }
    });
  }
}
