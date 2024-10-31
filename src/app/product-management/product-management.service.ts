import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { tableColumns } from '../interface/Table';
import { ProductTable } from '../interface/product-management/ProductTable';

@Injectable({
  providedIn: 'root',
})
export class ProductManagementService {
  private products: ProductTable[] = [
    {
      id: 'P001',
      name: 'Running Shoes',
      category: 'Shoes',
      brand: 'Nike',
      status: 'available',
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 1299000,
      stock: 50,
      description:
        'Lightweight running shoes for men, comfortable and durable.',
    },
    {
      id: 'P002',
      name: 'Basketball Shoes',
      category: 'Shoes',
      brand: 'Adidas',
      status: 'available',
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 1499000,
      stock: 30,
      description:
        'High-performance basketball shoes for optimal grip and support.',
    },
    {
      id: 'P003',
      name: 'Casual Sneakers',
      category: 'Shoes',
      brand: 'Puma',
      status: 'available',
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 899000,
      stock: 60,
      description: 'Stylish casual sneakers for everyday wear.',
    },
    {
      id: 'P004',
      name: 'Tennis Shoes',
      category: 'Shoes',
      brand: 'Nike',
      status: 'available',
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 1199000,
      stock: 40,
      description: 'Durable tennis shoes for enhanced movement on the court.',
    },
    {
      id: 'P005',
      name: 'Football Cleats',
      category: 'Shoes',
      brand: 'Adidas',
      status: 'available',
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 1799000,
      stock: 20,
      description:
        'Professional football cleats designed for maximum traction.',
    },
    {
      id: 'P006',
      name: 'Training Shoes',
      category: 'Shoes',
      brand: 'Under Armour',
      status: 'out-of-stock',
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 1099000,
      stock: 0,
      description: 'Flexible training shoes for a variety of workouts.',
    },
    {
      id: 'P007',
      name: 'Hiking Boots',
      category: 'Shoes',
      brand: 'The North Face',
      status: 'available',
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 2299000,
      stock: 15,
      description: 'Waterproof hiking boots with superior ankle support.',
    },
    {
      id: 'P008',
      name: 'Walking Shoes',
      category: 'Shoes',
      brand: 'New Balance',
      status: 'available',
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 999000,
      stock: 25,
      description: 'Comfortable walking shoes for everyday use.',
    },
    {
      id: 'P009',
      name: 'Skateboarding Shoes',
      category: 'Shoes',
      brand: 'Vans',
      status: 'available',
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 799000,
      stock: 40,
      description: 'Durable skate shoes with excellent grip for tricks.',
    },
    {
      id: 'P010',
      name: 'Trail Running Shoes',
      category: 'Shoes',
      brand: 'Salomon',
      status: 'available',
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 1999000,
      stock: 35,
      description: 'Lightweight trail running shoes with superior grip.',
    },
    {
      id: 'P011',
      name: 'Gym Shoes',
      category: 'Shoes',
      brand: 'Reebok',
      status: 'available',
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 899000,
      stock: 20,
      description: 'High-performance shoes for gym workouts.',
    },
    {
      id: 'P012',
      name: 'Soccer Cleats',
      category: 'Shoes',
      brand: 'Puma',
      status: 'available',
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 1599000,
      stock: 25,
      description: 'Lightweight soccer cleats for fast movement on the field.',
    },
    {
      id: 'P013',
      name: 'Golf Shoes',
      category: 'Shoes',
      brand: 'Nike',
      status: 'available',
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 2199000,
      stock: 30,
      description: 'Stable golf shoes with waterproof materials.',
    },
    {
      id: 'P014',
      name: 'Crossfit Shoes',
      category: 'Shoes',
      brand: 'Reebok',
      status: 'available',
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 1299000,
      stock: 35,
      description: 'Shoes built for crossfit with enhanced grip and stability.',
    },
    {
      id: 'P015',
      name: 'Running Shoes',
      category: 'Shoes',
      brand: 'Asics',
      status: 'available',
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 1399000,
      stock: 20,
      description:
        'Premium running shoes with superior comfort and breathability.',
    },
    {
      id: 'P016',
      name: 'Indoor Court Shoes',
      category: 'Shoes',
      brand: 'Mizuno',
      status: 'available',
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 999000,
      stock: 40,
      description:
        'Shoes designed for indoor court sports like badminton and volleyball.',
    },
    {
      id: 'P017',
      name: 'Climbing Shoes',
      category: 'Shoes',
      brand: 'La Sportiva',
      status: 'available',
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 1899000,
      stock: 15,
      description: 'High-grip climbing shoes for challenging terrains.',
    },
    {
      id: 'P018',
      name: 'Sandals',
      category: 'Shoes',
      brand: 'Birkenstock',
      status: 'available',
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 599000,
      stock: 50,
      description: 'Comfortable sandals for casual wear.',
    },
    {
      id: 'P019',
      name: 'Leather Boots',
      category: 'Shoes',
      brand: 'Timberland',
      status: 'available',
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 2499000,
      stock: 20,
      description: 'Durable leather boots for outdoor use.',
    },
    {
      id: 'P020',
      name: 'Winter Boots',
      category: 'Shoes',
      brand: 'Columbia',
      status: 'available',
      image:
        'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 2999000,
      stock: 10,
      description:
        'Insulated winter boots for extreme cold weather conditions.',
    },
    // Continue adding more shoes with unique IDs up to P030
  ];

  // thead: tableColumns[] = [
  //   { title: 'No.', class: '', sortable = false},
  //   { title: 'Product Name', class: '' },
  //   { title: 'Brand', class: '' },
  //   { title: 'Category', class: '' },
  //   { title: 'Price', class: '' },
  //   { title: 'Thumbnail', class: 'text-center' },
  //   { title: 'Status', class: 'text-center' },
  //   { title: 'Actions', class: 'text-center' },
  // ];

  // getThead() {
  //   return this.thead;
  // }

  constructor() {}

  getProducts(): Observable<ProductTable[]> {
    return of(this.products).pipe(delay(500)); // Simulate network delay
  }

  getProductById(id: string): Observable<ProductTable> {
    const product = this.products.find((p) => p.id === id);
    if (product) {
      return of(product).pipe(delay(300)); // Simulate network delay
    } else {
      return throwError(() => new Error('Product not found'));
    }
  }

  addProduct(product: ProductTable): Observable<ProductTable> {
    const newProduct = { ...product, id: this.generateId() };
    this.products.push(newProduct);
    return of(newProduct).pipe(delay(500)); // Simulate network delay
  }

  updateProduct(updatedProduct: ProductTable): Observable<ProductTable> {
    const index = this.products.findIndex((p) => p.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
      return of(updatedProduct).pipe(delay(500)); // Simulate network delay
    } else {
      return throwError(() => new Error('Product not found'));
    }
  }

  deleteProduct(id: string): Observable<boolean> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      return of(true).pipe(delay(500)); // Simulate network delay
    } else {
      return throwError(() => new Error('Product not found'));
    }
  }

  getProductsByStatus(status: string): Observable<ProductTable[]> {
    return of(this.products.filter((p) => p.status === status)).pipe(
      delay(500)
    );
  }

  searchProducts(term: string): Observable<ProductTable[]> {
    const lowercaseTerm = term.toLowerCase();
    return of(
      this.products.filter(
        (p) =>
          p.name.toLowerCase().includes(lowercaseTerm) ||
          p.brand.toLowerCase().includes(lowercaseTerm) ||
          p.category.toLowerCase().includes(lowercaseTerm)
      )
    ).pipe(delay(500));
  }

  private generateId(): string {
    const lastId = this.products[this.products.length - 1]?.id || 'SP000';
    const numericPart = parseInt(lastId.slice(2)) + 1;
    return `SP${numericPart.toString().padStart(3, '0')}`;
  }
}
