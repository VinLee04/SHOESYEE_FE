import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { VNPAYReturn } from '../shopping-cart.component';
import { CommonModule } from '@angular/common';
import { OrderManagementService } from '../../order-management/order.service';

@Component({
  selector: 'app-shopping-cart-checkout-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shopping-cart-checkout-status.component.html',
  styleUrl: './shopping-cart-checkout-status.component.scss',
  animations: [
    trigger('fadeSlideInOut', [
      state(
        'void',
        style({
          transform: 'translate(-50%, -60%)',
          opacity: 0,
        })
      ),
      transition('void <=> *', animate('400ms cubic-bezier(0.4, 0, 0.2, 1)')),
    ]),
  ],
})
export class ShoppingCartCheckoutStatusComponent {
  @Input() vnpayReturn!: VNPAYReturn;
  @Input() showCheckoutStatus: boolean = false;
  @Output() close = new EventEmitter<void>();

  statusIcon: string = '';
  statusClass: string = '';

  ngOnInit() {
    this.setStatusStyle();
  }

  setStatusStyle() {
    if (this.vnpayReturn.code === '00') {
      this.statusIcon = '✓';
      this.statusClass = 'success';
      this.orderManagementService.updateQuantityAfterOrder(Number(this.vnpayReturn.orderId)!);
    } else {
      this.statusIcon = '✕';
      this.statusClass = 'error';
    }
  }

  orderManagementService = inject(OrderManagementService);

  closeStatus() {
    this.close.emit();
  }

  getStatusMessage(): string {
    const codeMessages: { [key: string]: string } = {
      '00': 'Payment Successful',
      '01': 'Order Not Found',
      '02': 'Order Already Confirmed',
      '04': 'Invalid Amount',
      '99': 'Unknown Error',
    };
    return codeMessages[this.vnpayReturn.code || ''] || 'Unknown Error';
  }
}