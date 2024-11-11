import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { PageManagement, tableColumns } from '../interface/Table';
import { HttpClient } from '@angular/common/http';
import { ListSearchRequest, PageResponse } from '../interface/PageRequest';
import { API_URL_PRODUCTS, API_URL_UPLOADS } from '../../environment';
import { productInfo, ProductTable } from '../interface/Product';

@Injectable({
  providedIn: 'root',
})
export class ProductManagementService {
  private products: ProductTable[] = [
    {
      id: 'P001',
      name: 'Running Shoes',
      categoryName

: 'Shoes',
      brandName: 'Nike',
      status: 'available',
      thumbnail:
        'https://assets.adidas.com/thumbnails/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 1299000,
      stock: 50,
      isActive: true,
      color: ['white', 'black', 'green'],
      description:
        'Lightweight running shoes for men, comfortable and durable.',
    },
    {
      id: 'P002',
      name: 'Basketball Shoes',
      categoryName: 'Shoes',
      brandName: 'Adidas',
      status: 'available',
      thumbnail:
        'https://assets.adidas.com/thumbnails/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 1499000,
      stock: 30,
      isActive: true,
      color: ['white', 'black', 'green'],
      description:
        'High-performance basketball shoes for optimal grip and support.',
    },
    {
      id: 'P003',
      name: 'Casual Sneakers',
      categoryName: 'Shoes',
      brandName: 'Puma',
      status: 'available',
      thumbnail:
        'https://assets.adidas.com/thumbnails/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 899000,
      stock: 60,
      isActive: true,
      color: ['white', 'black', 'green'],
      description: 'Stylish casual sneakers for everyday wear.',
    },
    {
      id: 'P004',
      name: 'Tennis Shoes',
      categoryName: 'Shoes',
      brandName: 'Nike',
      status: 'available',
      thumbnail:
        'https://assets.adidas.com/thumbnails/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 1199000,
      stock: 40,
      isActive: true,
      color: ['white', 'black', 'green'],
      description: 'Durable tennis shoes for enhanced movement on the court.',
    },
    {
      id: 'P005',
      name: 'Football Cleats',
      categoryName: 'Shoes',
      brandName: 'Adidas',
      status: 'available',
      thumbnail:
        'https://assets.adidas.com/thumbnails/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 1799000,
      stock: 20,
      isActive: true,
      color: ['white', 'black', 'green'],
      description:
        'Professional football cleats designed for maximum traction.',
    },
    {
      id: 'P006',
      name: 'Training Shoes',
      categoryName: 'Shoes',
      brandName: 'Under Armour',
      status: 'out-of-stock',
      thumbnail:
        'https://assets.adidas.com/thumbnails/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 1099000,
      stock: 0,
      isActive: true,
      color: ['white', 'black', 'green'],
      description: 'Flexible training shoes for a variety of workouts.',
    },
    {
      id: 'P007',
      name: 'Hiking Boots',
      categoryName: 'Shoes',
      brandName: 'The North Face',
      status: 'available',
      thumbnail:
        'https://assets.adidas.com/thumbnails/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 2299000,
      stock: 15,
      isActive: true,
      color: ['white', 'black', 'green'],
      description: 'Waterproof hiking boots with superior ankle support.',
    },
    {
      id: 'P008',
      name: 'Walking Shoes',
      categoryName: 'Shoes',
      brandName: 'New Balance',
      status: 'available',
      thumbnail:
        'https://assets.adidas.com/thumbnails/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 999000,
      stock: 25,
      isActive: true,
      color: ['white', 'black', 'green'],
      description: 'Comfortable walking shoes for everyday use.',
    },
    {
      id: 'P009',
      name: 'Skateboarding Shoes',
      categoryName: 'Shoes',
      brandName: 'Vans',
      status: 'available',
      thumbnail:
        'https://assets.adidas.com/thumbnails/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 799000,
      stock: 40,
      isActive: true,
      color: ['white', 'black', 'green'],
      description: 'Durable skate shoes with excellent grip for tricks.',
    },
    {
      id: 'P010',
      name: 'Trail Running Shoes',
      categoryName: 'Shoes',
      brandName: 'Salomon',
      status: 'available',
      thumbnail:
        'https://assets.adidas.com/thumbnails/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 1999000,
      stock: 35,
      isActive: true,
      color: ['white', 'black', 'green'],
      description: 'Lightweight trail running shoes with superior grip.',
    },
    {
      id: 'P011',
      name: 'Gym Shoes',
      categoryName: 'Shoes',
      brandName: 'Reebok',
      status: 'available',
      thumbnail:
        'https://assets.adidas.com/thumbnails/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 899000,
      stock: 20,
      isActive: true,
      color: ['white', 'black', 'green'],
      description: 'High-performance shoes for gym workouts.',
    },
    {
      id: 'P012',
      name: 'Soccer Cleats',
      categoryName: 'Shoes',
      brandName: 'Puma',
      status: 'available',
      thumbnail:
        'https://assets.adidas.com/thumbnails/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 1599000,
      stock: 25,
      isActive: true,
      color: ['white', 'black', 'green'],
      description: 'Lightweight soccer cleats for fast movement on the field.',
    },
    {
      id: 'P013',
      name: 'Golf Shoes',
      categoryName: 'Shoes',
      brandName: 'Nike',
      status: 'available',
      thumbnail:
        'https://assets.adidas.com/thumbnails/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 2199000,
      stock: 30,
      isActive: true,
      color: ['white', 'black', 'green'],
      description: 'Stable golf shoes with waterproof materials.',
    },
    {
      id: 'P014',
      name: 'Crossfit Shoes',
      categoryName: 'Shoes',
      brandName: 'Reebok',
      status: 'available',
      thumbnail:
        'https://assets.adidas.com/thumbnails/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 1299000,
      stock: 35,
      isActive: true,
      color: ['white', 'black', 'green'],
      description: 'Shoes built for crossfit with enhanced grip and stability.',
    },
    {
      id: 'P015',
      name: 'Running Shoes',
      categoryName: 'Shoes',
      brandName: 'Asics',
      status: 'available',
      thumbnail:
        'https://assets.adidas.com/thumbnails/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 1399000,
      stock: 20,
      isActive: true,
      color: ['white', 'black', 'green'],
      description:
        'Premium running shoes with superior comfort and breathability.',
    },
    {
      id: 'P016',
      name: 'Indoor Court Shoes',
      categoryName: 'Shoes',
      brandName: 'Mizuno',
      status: 'available',
      thumbnail:
        'https://assets.adidas.com/thumbnails/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 999000,
      stock: 40,
      isActive: true,
      color: ['white', 'black', 'green'],
      description:
        'Shoes designed for indoor court sports like badminton and volleyball.',
    },
    {
      id: 'P017',
      name: 'Climbing Shoes',
      categoryName: 'Shoes',
      brandName: 'La Sportiva',
      status: 'available',
      thumbnail:
        'https://assets.adidas.com/thumbnails/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 1899000,
      stock: 15,
      isActive: true,
      color: ['white', 'black', 'green'],
      description: 'High-grip climbing shoes for challenging terrains.',
    },
    {
      id: 'P018',
      name: 'Sandals',
      categoryName: 'Shoes',
      brandName: 'Birkenstock',
      status: 'available',
      thumbnail:
        'https://assets.adidas.com/thumbnails/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 599000,
      stock: 50,
      isActive: true,
      color: ['white', 'black', 'green'],
      description: 'Comfortable sandals for casual wear.',
    },
    {
      id: 'P019',
      name: 'Leather Boots',
      categoryName: 'Shoes',
      brandName: 'Timberland',
      status: 'available',
      thumbnail:
        'https://assets.adidas.com/thumbnails/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 2499000,
      stock: 20,
      isActive: true,
      color: ['white', 'black', 'green'],
      description: 'Durable leather boots for outdoor use.',
    },
    {
      id: 'P020',
      name: 'Winter Boots',
      categoryName: 'Shoes',
      brandName: 'Columbia',
      status: 'available',
      thumbnail:
        'https://assets.adidas.com/thumbnails/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg',
      price: 2999000,
      stock: 10,
      isActive: true,
      color: ['white', 'black', 'green'],
      description:
        'Insulated winter boots for extreme cold weather conditions.',
    },
  ];

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductTable[]> {
    return of(this.products).pipe(delay(500)); // Simulate network delay
  }

  private readonly productPageSignal = signal<
    PageManagement<ProductTable> | undefined
  >(undefined);

  getProductPage(searchRequest: ListSearchRequest): Observable<PageManagement<ProductTable>>{
    return this.http.post<PageResponse>(`${API_URL_PRODUCTS}/specification/pagination/management`, searchRequest).pipe(
      map(({content, pageable, totalElements, totalPages}) => {
        if(!content) throw new Error("Hông có giá trị")

          const productPage: PageManagement<ProductTable> = {
            ItemsManagementPage: content.map((product: ProductTable) => ({
              ...product,
              thumbnail: product.thumbnail
                ? `${API_URL_UPLOADS}/product-images/${product.thumbnail}`
                : `${API_URL_UPLOADS}/product-images/default.png`,
            })),
            totalElements: totalElements,
            totalPages: totalPages,
            pageSize: pageable.pageSize,
            currentPage: pageable.pageNumber,
          };

          this.productPageSignal.set(productPage);
          return productPage;     
      })
    )
  }

  getProductPageSignal() {
    return this.productPageSignal;
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
          p.brandName.toLowerCase().includes(lowercaseTerm) ||
          p.categoryName.toLowerCase().includes(lowercaseTerm)
      )
    ).pipe(delay(500));
  }

  private generateId(): string {
    const lastId = this.products[this.products.length - 1]?.id || 'SP000';
    const numericPart = parseInt(lastId.slice(2)) + 1;
    return `SP${numericPart.toString().padStart(3, '0')}`;
  }

  tableColumns: tableColumns[] = [
    { key: 'id', title: 'No.', sortable: false },
    { key: 'productInfo', title: 'Product', sortable: true },
    { key: 'stock', title: 'stock', sortable: true },
    { key: 'status', title: 'status', sortable: true },
    { key: 'categoryName', title: 'categoryName', sortable: true },
    { key: 'price', title: 'Price', sortable: true },
    { key: 'discountPercent', title: 'Discount', sortable: true, class: 'text-center'  },
    { key: 'action', title: 'Actions', sortable: false, class: 'text-center' },
  ];

  filterValues: {
    email?: string;
    phone?: string;
    role?: string;
    gender?: boolean | null;
    status?: boolean | null;
  } = {
    status: true,
  };
}
