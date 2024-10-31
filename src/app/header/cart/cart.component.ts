import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  items: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  close = output<boolean>();


  closeCart() {
    this.close.emit(true);
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
