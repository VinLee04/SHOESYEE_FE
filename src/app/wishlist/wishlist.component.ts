import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})

export class WishlistComponent {
wishlistItems: Product[] = [
    { id: 1, name: 'Sofa For Living Room', price: 250.00, image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg', inStock: true },
    { id: 2, name: 'Sofa For Living Room', price: 250.00, image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fcc143f8340a43cf90e09dad71a3c7e4_9366/Adifom_Climacool_Shoes_Grey_IF3935_01_standard.jpg', inStock: false },
  ];

  removeItem(id: number): void {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== id);
  }

}
