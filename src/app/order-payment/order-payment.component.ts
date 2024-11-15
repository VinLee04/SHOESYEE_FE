// order-payment.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from './order.service';
import { CommonModule } from '@angular/common';
import { GhnService } from './ghn.service';
import { AuthService } from '../common/service/auth.service';

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

interface ServiceType {
  service_id: number;
  short_name: string;
  service_type_id: number;
}

interface PaymentMethod {
  id: number;
  name: string;
  type: 'CASH' | 'VNPAY';
}

interface Order {
  id: number;
  customerName?: string;
  phone?: string;
  provinceId?: number;
  districtId?: number;
  wardCode?: string;
  serviceTypeId?: number;
  shipAddress?: string;
  paymentMethodId?: number;
  note?: string;
  status: string;
}

@Component({
  selector: 'app-order-payment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './order-payment.component.html',
  styleUrls: ['./order-payment.component.scss'],
})
export class OrderPaymentComponent implements OnInit {
  orderForm!: FormGroup;
  provinces: Province[] = [];
  districts: District[] = [];
  wards: Ward[] = [];
  serviceTypes: ServiceType[] = [];
  orderId!: number;
  selectedProvince?: number;
  selectedDistrict?: number;

  paymentMethods: PaymentMethod[] = [
    { id: 1, name: 'Cash', type: 'CASH' },
    { id: 2, name: 'VNPAY', type: 'VNPAY' },
  ];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private ghnService: GhnService
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.orderForm = this.fb.group({
      customerName: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      provinceId: ['', [Validators.required]],
      districtId: ['', [Validators.required]],
      wardCode: ['', [Validators.required]],
      serviceTypeId: ['', [Validators.required]],
      shipAddress: ['', [Validators.required]],
      paymentMethodId: ['', [Validators.required]],
      note: [''],
    });

    // Subscribe to province changes
    this.orderForm.get('provinceId')?.valueChanges.subscribe((provinceId) => {
      if (provinceId) {
        this.onProvinceChange(provinceId);
        this.orderForm.patchValue({
          districtId: '',
          wardCode: '',
        });
      }
    });

    // Subscribe to district changes
    this.orderForm.get('districtId')?.valueChanges.subscribe((districtId) => {
      if (districtId) {
        this.onDistrictChange(districtId);
        this.orderForm.patchValue({
          wardCode: '',
        });
      }
    });
  }

  auth = inject(AuthService);

 
  ngOnInit(): void {
    this.loadProvinces();
    this.route.params.subscribe((params) => {
      this.orderId = params['id'];
      this.loadOrderDetails();
    });
  }

  private loadProvinces(): void {
    this.ghnService.getProvinces().subscribe(
      (response) => {
        if (response.code === 200) {
          this.provinces = response.data;
        }
      },
      (error) => console.error('Error loading provinces:', error)
    );
  }

  onProvinceChange(provinceId: number): void {
    this.ghnService.getDistricts(provinceId).subscribe(
      (response) => {
        if (response.code === 200) {
          this.districts = response.data;
        }
      },
      (error) => console.error('Error loading districts:', error)
    );
  }

  onDistrictChange(districtId: number): void {
    this.ghnService.getWards(districtId).subscribe(
      (response) => {
        if (response.code === 200) {
          this.wards = response.data;
        }
      },
      (error) => console.error('Error loading wards:', error)
    );

    // Load available services for the selected district
    this.loadAvailableServices(districtId);
  }

  transportNames: string[] = ['GHN'];

  getTransportName(): string {
    return this.transportNames[0];
  }

  private loadAvailableServices(districtId: number): void {
    this.ghnService.getAvailableServices(districtId).subscribe(
      (response) => {
        if (response.code === 200) {
          this.serviceTypes = response.data;
        }
      },
      (error) => console.error('Error loading services:', error)
    );
  }

  private loadOrderDetails(): void {
    this.orderService.getOrder(this.orderId).subscribe((order) => {
      if (order) {
        this.orderForm.patchValue({
          customerName: order.customerName || '',
          phone: order.phone || '',
          provinceId: order.provinceId || '',
          districtId: order.districtId || '',
          wardCode: order.wardCode || '',
          serviceTypeId: order.serviceTypeId || '',
          shipAddress: order.shipAddress || '',
          paymentMethodId: order.paymentMethodId || '',
          note: order.note || '',
        });
      }
    });
  }

  getFormControl(controlName: string) {
    return this.orderForm.get(controlName);
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const orderData: Order = {
        ...this.orderForm.value,
        id: this.orderId,
        status: 'PROCESSING',
      };

      this.orderService.updateOrder(orderData).subscribe((response) => {
        const paymentMethodId = this.getFormControl('paymentMethodId')?.value;

        if (paymentMethodId === 2) {
          // VNPAY payment
          this.orderService
            .getPaymentUrl(this.orderId)
            .subscribe((paymentResponse) => {
              if (paymentResponse?.result?.paymentUrl) {
                window.location.href = paymentResponse.result.paymentUrl;
              }
            });
        } else {
          // Cash payment
          this.router.navigate(['/order-success', this.orderId]);
        }
      });
    }
  }
}