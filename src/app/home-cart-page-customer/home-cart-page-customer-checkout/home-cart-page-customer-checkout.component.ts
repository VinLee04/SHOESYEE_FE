import { Component, ElementRef, inject, input, OnInit, output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HomeCartPageCustomerService } from '../home-cart-page-customer.service';
import { CheckoutRequest, PaymentMethod, PaymentService } from './payment.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GhnService } from '../../order-payment/ghn.service';
import { AuthService } from '../../common/service/auth.service';
import { ApiResponse, DataResponse } from '../../interface/ApiResponse';

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


@Component({
  selector: 'app-home-cart-page-customer-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home-cart-page-customer-checkout.component.html',
  styleUrl: './home-cart-page-customer-checkout.component.scss',
})
export class HomeCartPageCustomerCheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  currentStep = 1;
  totalSteps = 3;
  loading = false;

  @ViewChild('modal') modal!: ElementRef;
  close = input<boolean>();
  closeChange = output<boolean>();

  // Location data
  provinces: Province[] = [];
  districts: District[] = [];
  wards: Ward[] = [];
  serviceTypes: ServiceType[] = [];

  paymentMethods: PaymentMethod[] = [
    {
      id: 1,
      name: 'Cash On Delivery',
      type: 'CASH',
      description: 'Pay when you receive your order',
      isActive: true,
    },
    {
      id: 2,
      name: 'VNPAY',
      type: 'VNPAY',
      description: 'Pay securely with VNPAY',
      isActive: true,
    },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ghnService: GhnService,
    private paymentService: PaymentService,
    private cartService: HomeCartPageCustomerService
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.checkoutForm = this.fb.group({
      customerInfo: this.fb.group({
        customerName: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        email: ['', [Validators.required, Validators.email]],
      }),
      shippingInfo: this.fb.group({
        provinceId: ['', [Validators.required]],
        districtId: ['', [Validators.required]],
        wardCode: ['', [Validators.required]],
        serviceTypeId: ['', [Validators.required]],
        address: ['', [Validators.required]],
        note: [''],
        fullAddress: [''], // Hidden control to store full address
      }),
      paymentInfo: this.fb.group({
        paymentMethodId: ['', [Validators.required]],
      }),
    });

    this.checkoutForm
      .get('shippingInfo.provinceId')
      ?.valueChanges.subscribe((provinceId) => {
        if (provinceId) {
          this.onProvinceChange(provinceId);
          this.checkoutForm.patchValue({
            shippingInfo: {
              districtId: '',
              wardCode: '',
              serviceTypeId: '',
            },
          });
        }
      });

    this.checkoutForm
      .get('shippingInfo.districtId')
      ?.valueChanges.subscribe((districtId) => {
        if (districtId) {
          this.onDistrictChange(districtId);
          this.checkoutForm.patchValue({
            shippingInfo: {
              wardCode: '',
              serviceTypeId: '',
            },
          });
        }
      });

    const shippingInfo = this.checkoutForm.get('shippingInfo');
    if (shippingInfo) {
      shippingInfo.valueChanges.subscribe((value) => {
        if (
          value.provinceId &&
          value.districtId &&
          value.wardCode &&
          value.address
        ) {
          const province =
            this.provinces.find(
              (p) => p.ProvinceID === parseInt(value.provinceId)
            )?.ProvinceName || '';
          const district =
            this.districts.find(
              (d) => d.DistrictID === parseInt(value.districtId)
            )?.DistrictName || '';
          const ward =
            this.wards.find((w) => w.WardCode === value.wardCode)?.WardName ||
            '';
          const fullAddress = `${value.address}, ${ward}, ${district}, ${province}`;
          shippingInfo.patchValue({ fullAddress }, { emitEvent: false });
        }
      });
    }
  }

  ngOnInit(): void {
    this.loadProvinces();
    this.loadPaymentMethods();
    this.populateForm();
  }

  auth = inject(AuthService);

  private populateForm(): void {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      // Populate customer info
      this.checkoutForm.patchValue({
        customerInfo: {
          customerName: currentUser.username,
          phone: currentUser.phone,
          email: currentUser.email,
        },
        shippingInfo: {
          address: currentUser.address,
        },
      });

      // If user has address, parse and populate shipping info
      if (currentUser.address) {
        // Assuming address format: "detailed address, ward, district, province"
        const addressParts = currentUser.address
          .split(',')
          .map((part) => part.trim());
        if (addressParts.length >= 4) {
          const [detailedAddress, wardName, districtName, provinceName] =
            addressParts;

          // Find matching province, district, and ward
          setTimeout(() => {
            // Wait for provinces to load
            const province = this.provinces.find(
              (p) => p.ProvinceName === provinceName
            );
            if (province) {
              this.checkoutForm.patchValue({
                shippingInfo: {
                  provinceId: province.ProvinceID,
                  address: detailedAddress,
                },
              });

              // Load districts then find matching district
              this.ghnService
                .getDistricts(province.ProvinceID)
                .subscribe((response) => {
                  if (response.code === 200) {
                    this.districts = response.data;
                    const district = this.districts.find(
                      (d) => d.DistrictName === districtName
                    );
                    if (district) {
                      this.checkoutForm.patchValue({
                        shippingInfo: {
                          districtId: district.DistrictID,
                        },
                      });

                      // Load wards then find matching ward
                      this.ghnService
                        .getWards(district.DistrictID)
                        .subscribe((wardResponse) => {
                          if (wardResponse.code === 200) {
                            this.wards = wardResponse.data;
                            const ward = this.wards.find(
                              (w) => w.WardName === wardName
                            );
                            if (ward) {
                              this.checkoutForm.patchValue({
                                shippingInfo: {
                                  wardCode: ward.WardCode,
                                },
                              });
                            }
                          }
                        });
                    }
                  }
                });
            }
          }, 0);
        }
      }
    }
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

    this.loadAvailableServices(districtId);
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

  private loadPaymentMethods(): void {
    this.paymentService.getPaymentMethods().subscribe((methods) => {
      this.paymentMethods = methods.filter((m) => m.isActive);
    });
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      const currentGroup = this.getCurrentFormGroup();
      if (currentGroup.valid) {
        this.currentStep++;
      } else {
        this.markFormGroupTouched(currentGroup);
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  private getCurrentFormGroup(): FormGroup {
    switch (this.currentStep) {
      case 1:
        return this.checkoutForm.get('customerInfo') as FormGroup;
      case 2:
        return this.checkoutForm.get('shippingInfo') as FormGroup;
      case 3:
        return this.checkoutForm.get('paymentInfo') as FormGroup;
      default:
        return this.checkoutForm.get('customerInfo') as FormGroup;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getFormControl(groupName: string, controlName: string) {
    return this.checkoutForm.get(`${groupName}.${controlName}`);
  }

  private getFullAddress(): string {
    const shippingInfo = this.checkoutForm.get('shippingInfo')?.value;
    if (!shippingInfo) return '';

    const address = shippingInfo.address;
    const ward =
      this.wards.find((w) => w.WardCode === shippingInfo.wardCode)?.WardName ||
      '';
    const district =
      this.districts.find(
        (d) => d.DistrictID === Number(shippingInfo.districtId)
      )?.DistrictName || '';
    const province =
      this.provinces.find(
        (p) => p.ProvinceID === Number(shippingInfo.provinceId)
      )?.ProvinceName || '';

    // Lọc bỏ các phần tử rỗng và kết hợp với dấu phẩy
    return [address, ward, district, province]
      .filter((part) => part.trim())
      .join(', ');
  }

  async onSubmit() {
    if (this.checkoutForm.valid) {
      this.loading = true;
      try {
        const formValue = this.checkoutForm.value;
        const shippingInfo = formValue.shippingInfo;
        const fullAddress = this.getFullAddress();

        const orderRequest: CheckoutRequest = {
          userId: this.auth.currentUser?.id || '',
          totalAmount: this.orderSummary.total,
          note: formValue.shippingInfo.note || null,
          paymentMethodId: formValue.paymentInfo.paymentMethodId || null,
          districtId: Number(formValue.shippingInfo.districtId) || null,
          serviceTypeId: Number(formValue.shippingInfo.serviceTypeId) || null,
          transportName: 'GHN',
          customerName: formValue.customerInfo.customerName || null,
          phone: formValue.customerInfo.phone || null,
          wardCode: formValue.shippingInfo.wardCode || null,
          shipAddress: fullAddress || null,
        };

        const order: DataResponse<any> | undefined = await this.paymentService
          .placeOrder(
            Number(this.cartService.currentOrderValue?.orderId),
            orderRequest
          )
          .toPromise();

        if (order?.success) {
          const paymentMethodId = Number(
            this.checkoutForm.get('paymentInfo.paymentMethodId')?.value
          );

          if (paymentMethodId === 2) {
            this.paymentService
              .createPayment(
                Number(this.cartService.currentOrderValue?.orderId)
              )
              .subscribe((response: ApiResponse) => {
                window.location.href = response.result.paymentUrl;
              });
          } else if (paymentMethodId === 1) {
            this.cartService.clearCart();
            this.closeModal();
          }
        }
      } catch (error) {
        console.error('Checkout error:', error);
      } finally {
        this.loading = false;
      }
    } else {
      this.markFormGroupTouched(this.checkoutForm);
    }
  }

  // private getServiceName(serviceTypeId: number): string | null {
  //   const service = this.serviceTypes.find(
  //     (s) => s.service_type_id === serviceTypeId
  //   );
  //   return service ? service.short_name : null;
  // }

  get orderSummary() {
    const subtotal = this.cartService.totalAmount();
    const shipping = 30000; // Fixed shipping fee
    // const tax = subtotal * 0.1;
    return {
      subtotal,
      shipping,
      // tax,
      // total: subtotal + shipping + tax,
      total: subtotal + shipping,
    };
  }

  closeModal() {
    this.closeChange.emit(false);
    this.checkoutForm.reset();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === this.modal.nativeElement) {
      this.closeModal();
    }
  }
}