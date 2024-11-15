import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TestOrderService } from './testorder.service';
import { TestPaymentService } from './testpayment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testpayment',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './testpayment.component.html',
  styleUrl: './testpayment.component.scss',
})
export class TestpaymentComponent implements OnInit {
  orderForm: FormGroup;
  paymentMethods: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private orderService: TestOrderService,
    private paymentMethodService: TestPaymentService
  ) {
    this.orderForm = this.fb.group({
      customerName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      shipAddress: ['', Validators.required],
      wardCode: ['', Validators.required],
      districtId: ['', Validators.required],
      serviceTypeId: ['', Validators.required],
      paymentMethodId: ['', Validators.required],
      note: [''],
      transportName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadPaymentMethods();
  }

  loadPaymentMethods() {
    this.paymentMethodService.getPaymentMethods().subscribe({
      next: (methods) => {
        this.paymentMethods = methods;
      },
      error: (error) => {
        console.error('Error loading payment methods:', error);
        this.errorMessage = 'Failed to load payment methods';
      },
    });
  }

  onSubmit() {
    if (this.orderForm.valid) {
      this.isLoading = true;
      const orderData = {
        ...this.orderForm.value,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
      };

      this.orderService.updateOrder(orderData).subscribe({
        next: (response) => {
          // If payment method is VNPay, redirect to VNPay payment URL
          if (response.paymentMethod?.provider === 'VNPAY') {
            this.orderService.getVnpayPaymentUrl(response.id).subscribe({
              next: (paymentUrlResponse) => {
                window.location.href = paymentUrlResponse.result.paymentUrl;
              },
              error: (error) => {
                console.error('Error getting VNPay URL:', error);
                this.errorMessage = 'Failed to generate payment URL';
                this.isLoading = false;
              },
            });
          } else {
            // Handle cash payment
            console.log('Order placed successfully with cash payment');
            this.isLoading = false;
            // Redirect to confirmation page or show success message
          }
        },
        error: (error) => {
          console.error('Error updating order:', error);
          this.errorMessage = 'Failed to place order';
          this.isLoading = false;
        },
      });
    } else {
      this.markFormGroupTouched(this.orderForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}