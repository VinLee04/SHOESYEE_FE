import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  originalPrice: number;
  discountPercentage: number;
  image: string;
  category: string;
}

@Component({
  selector: 'app-sell-off',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sell-off.component.html',
  styleUrl: './sell-off.component.scss',
})
export class SellOffComponent {
  products: Product[] = [
    // Thêm dữ liệu mẫu ở đây
    {
      id: 1,
      name: 'Giày thể thao Nike Air Max',
      originalPrice: 3000000,
      discountPercentage: 20,
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      category: 'Thể thao',
    },
    {
      id: 2,
      name: 'Giày chạy bộ Adidas Ultraboost',
      originalPrice: 4000000,
      discountPercentage: 15,
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      category: 'Chạy bộ',
    },
    {
      id: 3,
      name: 'Giày đá banh Puma Future',
      originalPrice: 2500000,
      discountPercentage: 30,
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      category: 'Bóng đá',
    },
    // ... Thêm nhiều sản phẩm khác
  ];

  displayedProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  selectedDiscount: string = '';
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;

  ngOnInit() {
    this.categories = [
      ...new Set(this.products.map((product) => product.category)),
    ];
    this.applyFilters();
  }

  applyFilters() {
    let filteredProducts = this.products;

    if (this.selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === this.selectedCategory
      );
    }

    if (this.selectedDiscount) {
      const minDiscount = parseInt(this.selectedDiscount);
      filteredProducts = filteredProducts.filter(
        (product) => product.discountPercentage >= minDiscount
      );
    }

    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
      );
    }

    this.totalPages = Math.ceil(filteredProducts.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updateDisplayedProducts(filteredProducts);
  }

  updateDisplayedProducts(filteredProducts: Product[]) {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedProducts = filteredProducts.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  calculateDiscountedPrice(product: Product): number {
    return product.originalPrice * (1 - product.discountPercentage / 100);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilters();
    }
  }
}
