import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { ManagementNavbarComponent } from './management-navbar/management-navbar.component';
import { AuthService } from './common/service/auth.service';
import { NotificationComponent } from './notification/notification.component';
import { AccessManagementComponent } from './access-management/access-management.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ChangePasswordComponent } from './user-profile/change-password/change-password.component';
import { CommonModule } from '@angular/common';
import { HomeProductPageCustomerComponent } from './home-product-page-customer/home-product-page-customer.component';
import { HomeProductDetailPageCustomerMainComponent } from './home-product-detail-page-customer/home-product-detail-page-customer-main/home-product-detail-page-customer-main.component';
import { CartComponent } from './header/cart/cart.component';
import { ProductTessssComponent } from './product-tessss/product-tessss.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { ProductManagementAddEditComponent } from './product-management/product-management-add-edit/product-management-add-edit.component';
import { NavService } from './management-navbar/nav.service';
import { TestpaymentComponent } from './testpayment/testpayment.component';
import { TestGHNComponent } from './test-ghn/test-ghn.component';
import { OrderPaymentComponent } from './order-payment/order-payment.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { HomeCartPageCustomerCheckoutComponent } from './home-cart-page-customer/home-cart-page-customer-checkout/home-cart-page-customer-checkout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HomeComponent, FooterComponent, ManagementNavbarComponent , NotificationComponent,
    AccessManagementComponent, ResetPasswordComponent, HomeProductPageCustomerComponent, HomeProductDetailPageCustomerMainComponent, CartComponent
    ,ProductManagementAddEditComponent, ProductManagementComponent, TestpaymentComponent, TestGHNComponent, OrderPaymentComponent, HomeCartPageCustomerCheckoutComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'SHOESYEE-WEB-PROJECT';
  auth = inject(AuthService);
  nav = inject(NavService);
  show = true;
}
