import { Component } from '@angular/core';
import { CustomerProductDetailResponse, ProductOption, ProductOptionDetail } from '../interface/CustomerProduct';

@Component({
  selector: 'app-test-detail',
  standalone: true,
  imports: [],
  templateUrl: './test-detail.component.html',
  styleUrl: './test-detail.component.scss'
})
export class TestDetailComponent {
 productDetail!: CustomerProductDetailResponse;
  selectedOption: ProductOption | null = null;
  selectedDetail: ProductOptionDetail | null = null;
  quantity: number = 1;

  // constructor(
  //   private route: Router,
  //   private detailService: DetailService,
  // ) {}

  ngOnInit() {
    // const productId = this.route.snapshot.params['id'];
    // this.loadProductDetails(productId);
  }

  // async loadProductDetails(productId: number) {
  //   try {
  //     this.productDetail = await this.productService.getProductDetail(productId).toPromise();
  //     // Auto-select first color option
  //     if (this.productDetail?.options?.length > 0) {
  //       this.selectColor(this.productDetail.options[0]);
  //     }
  //   } catch (error) {
  //     console.error('Error loading product details:', error);
  //     // Handle error appropriately
  //   }
  // }

  selectColor(option: ProductOption) {
    this.selectedOption = option;
    this.selectedDetail = null; // Reset size selection
    this.quantity = 1; // Reset quantity
  }

  selectSize(detail: ProductOptionDetail) {
    this.selectedDetail = detail;
    this.quantity = 1; // Reset quantity when size changes
  }

  addToCart() {
    // if (this.selectedDetail && this.quantity) {
    //   const cartItem = {
    //     productDetailId: this.selectedDetail.id,
    //     quantity: this.quantity,
    //     // Optional: include more information for cart display
    //     productName: this.productDetail.product.name,
    //     color: this.selectedOption?.color,
    //     size: this.selectedDetail.size,
    //     price: this.selectedDetail.price
    //   };
      
    //   this.cartService.addToCart(cartItem).subscribe(
    //     success => {
    //       // Show success message
    //       console.log('Added to cart successfully');
    //     },
    //     error => {
    //       // Handle error
    //       console.error('Error adding to cart:', error);
    //     }
    //   );
    // }
  }
}
