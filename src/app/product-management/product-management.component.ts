import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductManagementService } from './product-management.service';
import { ManagementTableComponent } from '../common/management-table/management-table.component';
import { ProductTable } from '../interface/product-management/ProductTable';


@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ManagementTableComponent],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],
})
export class ProductManagementComponent implements OnInit {

  
  columns = [
    { key: 'id', title: 'Id', sortable: true },
    { key: 'name', title: 'Name', sortable: true },
    { key: 'brand', title: 'Brand', sortable: true },
    { key: 'category', title: 'Category', sortable: true },
    { key: 'price', title: 'Price', sortable: true },
    { key: 'image', title: 'Image', sortable: true },
    { key: 'status', title: 'Status' }
  ];

  onEditProduct(product: ProductTable) {
    this.selectedProduct = product;
  }

  onDeleteProduct(product: ProductTable) {
    // Handle delete
  }



  products: ProductTable[] = [];
  selectedProduct: ProductTable | null = null;

  totalProducts: number = 10932;

  activeTab:
    | 'All Products'
    | 'Live'
    | 'Archive'
    | 'Out of Stock'
    | 'Low Stock' = 'All Products';
  changeTab(tab: typeof this.activeTab): void {
    this.activeTab = tab;
  }

  
  newProduct: ProductTable = {
    id: '',
    name: '',
    category: '',
    brand: '',
    status: '',
    image: '',
    description: '',
    price: 0,
    stock: 0,
  };

  constructor(private productService: ProductManagementService) {}
  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(
      (products) => (this.products = products),
      (error) => console.error('Error loading products', error)
    );
  }

  selectProduct(product: ProductTable) {
    this.selectedProduct = { ...product };
  }

  saveProduct() {
    if (this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct).subscribe(() => {
        this.loadProducts();
        this.selectedProduct = null;
      });
    }
  }

  addProduct() {
    this.productService.addProduct(this.newProduct).subscribe(() => {
      this.loadProducts();
      this.newProduct = {
        id: '',
        name: '',
        category: '',
        brand: '',
        status: '',
        image: '',
        description: '',
        price: 0,
        stock: 0,
      };
    });
  }

  deleteProduct(product: ProductTable) {
    this.productService.deleteProduct(product.id).subscribe(() => {
      this.loadProducts();
      if (this.selectedProduct && this.selectedProduct.id === product.id) {
        this.selectedProduct = null;
      }
    });
  }
}
