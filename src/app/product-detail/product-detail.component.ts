import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReviewDetailComponent } from './review-detail/review-detail.component';
import { ActivatedRoute } from '@angular/router';

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
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, ReviewDetailComponent],
})
export class ProductDetailComponent implements OnInit {
  productId!: number;

  constructor(private route: ActivatedRoute) {}



  product!: ProductDetail;
  relatedProducts: ProductDetail[] = [];

  ngOnInit() {
    
    
    this.route.paramMap.subscribe((params) => {
      this.productId = Number(params.get('id'));

      alert(`your product Id is ${this.productId}`);
    });




    // Simulate fetching product details
    this.product = {
      id: 1,
      name: 'Classic White T-Shirt',
      price: 29.99,
      mainImage: 'shoes/shoesTest.png',
      images: [
        'shoes/shoesTest.png',
        'shoes/shoesTest.png',
        'shoes/shoesTest.png',
      ],
      sizes: ['37', '38', '39', '40', '41', '42'],
      colors: ['red', 'blue'],
      description:
        'A comfortable and versatile white t-shirt made from 100% organic cotton.',
      reviewCount: 24,
      reviews: [
        {
          id: 1,
          userName: 'Vĩnh Lợi',
          userImage: 'ourteam/loi.png',
          date: new Date('2024-10-15'),
          text: 'Great quality t-shirt. Fits perfectly and very comfortable.',
        },
        {
          id: 2,
          userName: 'Vĩnh Lợi',
          userImage: 'ourteam/loi.png',
          date: new Date('2024-10-12'),
          text: 'Love the fabric! Will definitely buy more.',
        },
      ],
    };

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

  selectSize(size: string) {
    console.log(`Selected size: ${size}`);
    // Implement size selection logic here
  }

  addToCart() {
    console.log('Product added to cart');
    // Implement add to cart logic here
  }
}
