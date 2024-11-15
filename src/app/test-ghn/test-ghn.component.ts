import { Component, OnInit } from '@angular/core';
import { TestOrderService } from '../testpayment/testorder.service';
import { TestPaymentService } from '../testpayment/testpayment.service';
import { GHNService } from './GHN.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Province {
  ProvinceID: number;
  ProvinceName: string;
}

interface District {
  DistrictID: number;
  DistrictName: string;
}

interface Ward {
  WardCode: string;
  WardName: string;
}

interface ShippingService {
  service_id: number;
  service_type_id: number;
  short_name: string;
}
@Component({
  selector: 'app-test-ghn',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './test-ghn.component.html',
  styleUrl: './test-ghn.component.scss',
})
export class TestGHNComponent implements OnInit {
  orderForm: FormGroup;
  paymentMethods: any[] = [];
  provinces: Province[] = [];
  districts: District[] = [];
  wards: Ward[] = [];
  shippingServices: ShippingService[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private orderService: TestOrderService,
    private paymentMethodService: TestPaymentService,
    private ghnService: GHNService
  ) {
    this.orderForm = this.fb.group({
      provinceId: ['', Validators.required],
      districtId: ['', Validators.required],
      wardCode: ['', Validators.required],
      serviceTypeId: ['', Validators.required],
      transportName: [{ value: 'GHN', disabled: true }],
      customerName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      shipAddress: ['', Validators.required],
      paymentMethodId: ['', Validators.required],
      note: [''],
    });

    // Subscribe to province changes
    this.orderForm.get('provinceId')?.valueChanges.subscribe((provinceId) => {
      if (provinceId) {
        this.loadDistricts(provinceId);
        this.orderForm.patchValue({
          districtId: '',
          wardCode: '',
        });
      }
    });

    // Subscribe to district changes
    this.orderForm.get('districtId')?.valueChanges.subscribe((districtId) => {
      if (districtId) {
        this.loadWards(districtId);
        this.loadShippingServices(districtId);
        this.orderForm.patchValue({
          wardCode: '',
        });
      }
    });
  }

  ngOnInit(): void {
    // this.loadPaymentMethods();
    this.loadProvinces();
  }

  loadProvinces() {
    this.ghnService.getProvinces().subscribe({
      next: (response) => {
        this.provinces = response.data;
      },
      error: (error) => {
        console.error('Error loading provinces:', error);
        this.errorMessage = 'Failed to load provinces';
      },
    });
  }

  loadDistricts(provinceId: number) {
    this.ghnService.getDistricts(provinceId).subscribe({
      next: (response) => {
        this.districts = response.data;
      },
      error: (error) => {
        console.error('Error loading districts:', error);
        this.errorMessage = 'Failed to load districts';
      },
    });
  }

  loadWards(districtId: number) {
    this.ghnService.getWards(districtId).subscribe({
      next: (response) => {
        this.wards = response.data;
      },
      error: (error) => {
        console.error('Error loading wards:', error);
        this.errorMessage = 'Failed to load wards';
      },
    });
  }

  loadShippingServices(districtId: number) {
    this.ghnService.getServices(districtId).subscribe({
      next: (response) => {
        this.shippingServices = response.data;
      },
      error: (error) => {
        console.error('Error loading shipping services:', error);
        this.errorMessage = 'Failed to load shipping services';
      },
    });
  }

  onSubmit() {
    if (this.orderForm.valid) {
      this.isLoading = true;
      const orderData = {
        ...this.orderForm.getRawValue(), // getRawValue() includes disabled controls
        status: 'PENDING',
        paymentStatus: 'UNPAID',
      };

      this.orderService.updateOrder(orderData).subscribe({
        next: (response) => {
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