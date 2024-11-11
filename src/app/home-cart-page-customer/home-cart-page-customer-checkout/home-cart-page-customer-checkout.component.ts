import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HomeCartPageCustomerService } from '../home-cart-page-customer.service';
import { PaymentService } from './payment.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-cart-page-customer-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home-cart-page-customer-checkout.component.html',
  styleUrl: './home-cart-page-customer-checkout.component.scss'
})
export class HomeCartPageCustomerCheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  paymentMethods: any[] = [];
  loading = false;
  currentStep = 1;
  totalSteps = 3;

  constructor(
    private fb: FormBuilder,
    private cartService: HomeCartPageCustomerService,
    private paymentService: PaymentService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      shippingInfo: this.fb.group({
        address: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        note: ['']
      }),
      paymentInfo: this.fb.group({
        paymentMethodId: ['', Validators.required],
      })
    });
  }

  ngOnInit() {
    this.loadPaymentMethods();
  }

  private loadPaymentMethods() {
    this.paymentService.getPaymentMethods().subscribe(
      methods => this.paymentMethods = methods.filter(m => m.isActive)
    );
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  async onSubmit() {
    if (this.checkoutForm.valid) {
      this.loading = true;
      try {
        // Place order first
        const order = await this.cartService.placeOrder(
          this.checkoutForm.get('shippingInfo.address')?.value,
          this.checkoutForm.get('shippingInfo.note')?.value
        ).toPromise();

        if (order && order.orderId) {
          // Create payment record
          const paymentResult = await this.paymentService.createPayment({
            orderId: order.orderId,
            paymentMethodId: this.checkoutForm.get('paymentInfo.paymentMethodId')?.value,
            amount: order.totalAmount || 0,
            status: 'PENDING'
          }).toPromise();

          if (paymentResult) {
            // Redirect to payment processing or confirmation
            this.router.navigate(['/payment-confirmation', order.orderId]);
          }
        }
      } catch (error) {
        console.error('Checkout error:', error);
        // Handle error appropriately
      } finally {
        this.loading = false;
      }
    }
  }

  get orderSummary() {
    return {
      subtotal: this.cartService.totalAmount(),
      shipping: 30000, // Fixed shipping fee
      tax: this.cartService.totalAmount() * 0.1,
      total: this.cartService.totalAmount() * 1.1 + 30000
    };
  }
}
