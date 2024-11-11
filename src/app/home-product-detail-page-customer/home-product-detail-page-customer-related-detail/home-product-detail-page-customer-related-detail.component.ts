import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface ProductDetail {
  id: number;
  name: string;
  price: number;
  mainImage: string;
  images: string[];
  colors: string[];
  sizes: string[];
  description: string;
  reviewCount: number;
  reviews: Review[];
}

interface Review {
  id: number;
  userName: string;
  userImage: string;
  date: Date;
  text: string;
}

@Component({
  selector: 'app-home-product-detail-page-customer-related-detail',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl:
    './home-product-detail-page-customer-related-detail.component.html',
  styleUrl: './home-product-detail-page-customer-related-detail.component.scss',
})
export class HomeProductDetailPageCustomerRelatedDetailComponent implements OnInit{
  relatedProducts: ProductDetail[] = [];
  
  ngOnInit(): void {
      
    // Simulate fetching related products
    this.relatedProducts = [
      {
        id: 2,
        name: 'Black V-Neck Tee',
        price: 24.99,
        mainImage: 'shoes/shoesTest.png',
        images: [],
        sizes: [],
        colors: [],
        description: '',
        reviewCount: 0,
        reviews: [],
      },
      {
        id: 3,
        name: 'Gray Crewneck Sweatshirt',
        price: 39.99,
        mainImage: 'shoes/shoesTest.png',
        images: [],
        colors: [],
        sizes: [],
        description: '',
        reviewCount: 0,
        reviews: [],
      },
      {
        id: 4,
        name: 'Blue Denim Shirt',
        price: 49.99,
        mainImage: 'shoes/shoesTest.png',
        images: [],
        colors: [],
        sizes: [],
        description: '',
        reviewCount: 0,
        reviews: [],
      },
    ];
  }
}
