import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ProductTable {
  id: string;
  rank: number;
  image: string;
  name: string;
  totalBuyers: number;
  price: number;
  stock: number;
  rating: 'Perfect' | 'Very Good' | 'Good' | 'Bad';
  status: 'Active' | 'Archive';
}


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  totalProducts: number = 10932;
  products: ProductTable[] = [
    {
      id: '#172828898',
      rank: 1,
      image: 'shoes/shoesTest.png',
      name: 'Givench Sweater',
      totalBuyers: 12990,
      price: 1234.82,
      stock: 231,
      rating: 'Perfect',
      status: 'Active',
    },
    {
      id: '#172828899',
      rank: 2,
      image: 'shoes/shoesTest.png',
      name: 'Givench Sweater',
      totalBuyers: 12990,
      price: 1234.82,
      stock: 432,
      rating: 'Very Good',
      status: 'Active',
    },
    // Add more sample data...
    {
      id: '#172828905',
      rank: 15,
      image: 'shoes/shoesTest.png',
      name: 'Givench Sweater',
      totalBuyers: 12990,
      price: 1234.82,
      stock: 432,
      rating: 'Good',
      status: 'Archive',
    },
  ];

  activeTab:
    | 'All Products'
    | 'Live'
    | 'Archive'
    | 'Out of Stock'
    | 'Low Stock' = 'All Products';

    
  searchQuery: string = '';

  constructor() {}

  ngOnInit(): void {}

  getRatingClass(rating: string): string {
    const baseClass = 'rating-indicator';
    switch (rating) {
      case 'Perfect':
        return `${baseClass} perfect`;
      case 'Very Good':
        return `${baseClass} very-good`;
      case 'Good':
        return `${baseClass} good`;
      case 'Bad':
        return `${baseClass} bad`;
      default:
        return baseClass;
    }
  }

  changeTab(tab: typeof this.activeTab): void {
    this.activeTab = tab;
  }
  // changeTab(tab: typeof this.activeTab): void {
  //   this.activeTab = tab;
  // }
}
