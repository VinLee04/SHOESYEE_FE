import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../common/service/auth.service';

@Component({
  selector: 'app-management-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './management-navbar.component.html',
  styleUrls: ['./management-navbar.component.scss'],
})
export class ManagementNavbarComponent {
  auth = inject(AuthService);
  userName: string = 'Your Name';
  managementItems: { name: string; icon: string }[] = [
    { name: 'Orders', icon: 'bx bx-package' }, // đơn hàng
    { name: 'Products', icon: 'bx bx-shopping-bag' }, // sản phẩm
    { name: 'Brands', icon: 'bx bx-clipboard' }, // nhãn hàng
    // { name: 'Categories', icon: 'bx bx-category' }, // thể loại
    { name: 'Authorization', icon: 'bx bx-category' }, // thể loại
    { name: 'Users', icon: 'bx bx-user' }, // người dùng
    { name: 'Promotions', icon: 'bx bx-gift' }, // khuyến mãi
    //test
    { name: 'Test 1', icon: 'bx bx-package' }, // đơn hàng
    { name: 'Test 2', icon: 'bx bx-shopping-bag' }, // sản phẩm
    { name: 'Test 3', icon: 'bx bx-clipboard' }, // nhãn hàng
    { name: 'Test 4', icon: 'bx bx-category' }, // thể loại
    { name: 'Test 5', icon: 'bx bx-user' }, // người dùng
    { name: 'Test 6', icon: 'bx bx-gift' }, // khuyến mãi
    { name: 'Test 7', icon: 'bx bx-package' }, // đơn hàng
    { name: 'Test 8', icon: 'bx bx-shopping-bag' }, // sản phẩm
    { name: 'Test 9', icon: 'bx bx-clipboard' }, // nhãn hàng
    { name: 'Test 10', icon: 'bx bx-category' }, // thể loại
    { name: 'Test 11', icon: 'bx bx-user' }, // người dùng
    { name: 'Test 12', icon: 'bx bx-gift' }, // khuyến mãi
  ];

  statisticsItems: string[] = ['Help & Center', 'Setting', 'Log out'];
}
