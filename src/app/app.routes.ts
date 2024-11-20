import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { ProductComponent } from './product/product.component';
import { DiscountComponent } from './discount/discount.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UserProfileEditComponent } from './user-profile/user-profile-edit/user-profile-edit.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SellOffComponent } from './sell-off/sell-off.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { ManagementNavbarComponent } from './management-navbar/management-navbar.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { TableComponent } from './common/table/table.component';
import { UserManagementFilterComponent } from './user-management/user-management-filter/user-management-filter.component';
import { AccessManagementComponent } from './access-management/access-management.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HomeProductPageCustomerComponent } from './home-product-page-customer/home-product-page-customer.component';
import { HomeProductDetailPageCustomerComponent } from './home-product-detail-page-customer/home-product-detail-page-customer.component';
import { ProductManagementAddEditComponent } from './product-management/product-management-add-edit/product-management-add-edit.component';
import { CustomerFeaturesComponent } from './customer-features/customer-features.component';
import { CustomerFeatureNavComponent } from './customer-features/customer-feature-nav/customer-feature-nav.component';
import { CustomerFeatureWishlistComponent } from './customer-features/customer-feature-wishlist/customer-feature-wishlist.component';
import { CustomerFeatureOrderComponent } from './customer-features/customer-feature-order/customer-feature-order.component';
import { OrderPaymentComponent } from './order-payment/order-payment.component';
import { OrderManagementComponent } from './order-management/order-management.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
  { path: 'forgot-password', component: ResetPasswordComponent },
  { path: 'check', component: OrderPaymentComponent },
  {
    path: 'product',
    children: [
      { path: '', component: HomeProductPageCustomerComponent },
      {
        path: 'viewDetail/:id',
        component: HomeProductDetailPageCustomerComponent,
      },
    ],
  },
  {
    path: 'customer-feature',
    component: CustomerFeaturesComponent,
    children: [
      {
        path: 'profile',
        component: UserProfileComponent,
        outlet: 'nav',
      },
      {
        path: 'order/:status', 
        component: CustomerFeatureOrderComponent,
        outlet: 'nav',
      },
      {
        path: 'wishlist',
        component: CustomerFeatureWishlistComponent,
        outlet: 'nav',
      },
      // {
      //   path: 'trade-ins',
      //   component: CustomerFeatureTradeInsComponent,
      //   outlet: 'nav',
      // },
    ],
  },
  { path: 'discount', component: DiscountComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'user-profile-edit', component: UserProfileEditComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'sell-off', component: SellOffComponent },

  // {
  //   path: 'ChartSecond',
  //   children: [
  //     { path: 'add', component: ChartJsonComponent },
  //     { path: 'edit/:id', component: ChartSecondComponent },
  //   ],
  // },
  // { path: 'Table/:id', component: TableComponent },

  {
    path: 'management',
    children: [
      { path: 'navbar', component: ManagementNavbarComponent },
      {
        path: 'products',
        children: [
          { path: '', component: ProductManagementComponent },
          { path: 'add', component: ProductManagementAddEditComponent },
        ],
      },
      { path: 'users', component: UserManagementComponent },
      { path: 'orders', component: OrderManagementComponent },
      { path: 'filter', component: UserManagementFilterComponent },
      { path: 'authorization', component: AccessManagementComponent },
    ],
  },

  { path: '**', component: NotFoundComponent },
];
