import { Component, OnInit } from '@angular/core';
import { ProductManagementService, TopSellingProduct } from '../product-management/product-management.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-top-5-selling',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-top-5-selling.component.html',
  styleUrl: './product-top-5-selling.component.scss',
})
export class ProductTop5SellingComponent implements OnInit {
  topProducts: TopSellingProduct[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private productService: ProductManagementService) {}

  ngOnInit(): void {
    this.loadTopSellingProducts();
  }

  loadTopSellingProducts(): void {
    this.isLoading = true;
    this.productService.getTopBestSellingProducts().subscribe({
      next: (products) => {
        this.topProducts = products;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load top selling products';
        this.isLoading = false;
        console.error('Error fetching top selling products', err);
      },
    });
  }
}