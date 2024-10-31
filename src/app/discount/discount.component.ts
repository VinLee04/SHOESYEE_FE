import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../product/product.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../common/service/auth.service';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  price: number;
  discountPercentage: number;
  image: string;
}

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class DiscountComponent implements OnInit {
  discountCode: string = '';
  discountMessage: string = '';
  discountApplied: boolean = false;

  applyDiscount() {
    // Giả lập việc áp dụng mã giảm giá
    if (this.discountCode === 'SALE10') {
      this.discountMessage = 'Mã giảm giá đã được áp dụng thành công!';
      this.discountApplied = true;
    } else {
      this.discountMessage = 'Mã giảm giá không hợp lệ.';
      this.discountApplied = false;
    }
  }
  // discountGroups = [
  //   {
  //     percent: 20,
  //     products: [
  //       {
  //         name: 'Nike Air Max',
  //         originalPrice: 150,
  //         discountedPrice: 120,
  //         image: 'assets/images/nike-air-max.jpg',
  //       },
  //       {
  //         name: 'Adidas Ultraboost',
  //         originalPrice: 180,
  //         discountedPrice: 144,
  //         image: 'assets/images/adidas-ultraboost.jpg',
  //       },
  //       {
  //         name: 'Puma Ignite',
  //         originalPrice: 140,
  //         discountedPrice: 112,
  //         image: 'assets/images/puma-ignite.jpg',
  //       },
  //     ],
  //   },
  //   {
  //     percent: 30,
  //     products: [
  //       {
  //         name: 'New Balance 990',
  //         originalPrice: 200,
  //         discountedPrice: 140,
  //         image: 'assets/images/new-balance-990.jpg',
  //       },
  //       {
  //         name: 'Asics Gel-Kayano',
  //         originalPrice: 170,
  //         discountedPrice: 119,
  //         image: 'assets/images/asics-gel-kayano.jpg',
  //       },
  //       {
  //         name: 'New Balance 990',
  //         originalPrice: 200,
  //         discountedPrice: 140,
  //         image: 'assets/images/new-balance-990.jpg',
  //       },
  //       {
  //         name: 'Asics Gel-Kayano',
  //         originalPrice: 170,
  //         discountedPrice: 119,
  //         image: 'assets/images/asics-gel-kayano.jpg',
  //       },
  //       {
  //         name: 'New Balance 990',
  //         originalPrice: 200,
  //         discountedPrice: 140,
  //         image: 'assets/images/new-balance-990.jpg',
  //       },
  //       {
  //         name: 'Asics Gel-Kayano',
  //         originalPrice: 170,
  //         discountedPrice: 119,
  //         image: 'assets/images/asics-gel-kayano.jpg',
  //       },
  //       {
  //         name: 'New Balance 990',
  //         originalPrice: 200,
  //         discountedPrice: 140,
  //         image: 'assets/images/new-balance-990.jpg',
  //       },
  //       {
  //         name: 'Asics Gel-Kayano',
  //         originalPrice: 170,
  //         discountedPrice: 119,
  //         image: 'assets/images/asics-gel-kayano.jpg',
  //       },
  //       {
  //         name: 'New Balance 990',
  //         originalPrice: 200,
  //         discountedPrice: 140,
  //         image: 'assets/images/new-balance-990.jpg',
  //       },
  //       {
  //         name: 'Asics Gel-Kayano',
  //         originalPrice: 170,
  //         discountedPrice: 119,
  //         image: 'assets/images/asics-gel-kayano.jpg',
  //       },
  //     ],
  //   },
  //   {
  //     percent: 50,
  //     products: [
  //       {
  //         name: 'Converse All-Star',
  //         originalPrice: 100,
  //         discountedPrice: 50,
  //         image: 'assets/images/converse-all-star.jpg',
  //       },
  //       {
  //         name: 'Vans Old Skool',
  //         originalPrice: 90,
  //         discountedPrice: 45,
  //         image: 'assets/images/vans-old-skool.jpg',
  //       },
  //       {
  //         name: 'Converse All-Star',
  //         originalPrice: 100,
  //         discountedPrice: 50,
  //         image: 'assets/images/converse-all-star.jpg',
  //       },
  //       {
  //         name: 'Vans Old Skool',
  //         originalPrice: 90,
  //         discountedPrice: 45,
  //         image: 'assets/images/vans-old-skool.jpg',
  //       },
  //       {
  //         name: 'Converse All-Star',
  //         originalPrice: 100,
  //         discountedPrice: 50,
  //         image: 'assets/images/converse-all-star.jpg',
  //       },
  //       {
  //         name: 'Vans Old Skool',
  //         originalPrice: 90,
  //         discountedPrice: 45,
  //         image: 'assets/images/vans-old-skool.jpg',
  //       },
  //       {
  //         name: 'Converse All-Star',
  //         originalPrice: 100,
  //         discountedPrice: 50,
  //         image: 'assets/images/converse-all-star.jpg',
  //       },
  //       {
  //         name: 'Vans Old Skool',
  //         originalPrice: 90,
  //         discountedPrice: 45,
  //         image: 'assets/images/vans-old-skool.jpg',
  //       },
  //       {
  //         name: 'Converse All-Star',
  //         originalPrice: 100,
  //         discountedPrice: 50,
  //         image: 'assets/images/converse-all-star.jpg',
  //       },
  //       {
  //         name: 'Vans Old Skool',
  //         originalPrice: 90,
  //         discountedPrice: 45,
  //         image: 'assets/images/vans-old-skool.jpg',
  //       },
  //     ],
  //   },
  // ];

  constructor() {}

  ngOnInit(): void {}
}
