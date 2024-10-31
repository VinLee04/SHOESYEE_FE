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

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
  { path: 'forgot-password', component: ResetPasswordComponent },
  {
    path: 'product',
    children: [
      { path: '', component: ProductComponent },
      { path: 'viewDetail/:id', component: ProductDetailComponent },
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
      { path: 'products', component: ProductManagementComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'orders', component: TableComponent },
      { path: 'filter', component: UserManagementFilterComponent },
      { path: 'authorization', component: AccessManagementComponent },

    ],
  },

  { path: '**', component: NotFoundComponent },
];
