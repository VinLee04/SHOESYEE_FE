import { Component, inject, ElementRef, HostListener, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../common/service/auth.service';
import { CartComponent } from './cart/cart.component';
import { API_URL_UPLOADS, environment } from '../../environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CartComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  auth = inject(AuthService);
  showMenu: boolean = false;
  isShowCart: boolean = false;

  userImage = computed(() => {
    const user = this.auth.currentUser;
    return user?.image ? `${API_URL_UPLOADS}/${user.image}` : `${API_URL_UPLOADS}/avatars/default.png`;
  });

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const cartIcon =
      this.elementRef.nativeElement.querySelector('.header-cart-icon');
    const cartComponent =
      this.elementRef.nativeElement.querySelector('app-cart');

    if (cartIcon && cartIcon.contains(event.target as Node)) {
      // Nếu click vào icon giỏ hàng, chuyển đổi trạng thái
      this.toggleCart();
    } else if (
      (!cartComponent || !cartComponent.contains(event.target as Node)) &&
      this.isShowCart
    ) {
      // Nếu click bên ngoài giỏ hàng và giỏ hàng đang mở, đóng giỏ hàng
      this.isShowCart = false;
    }
  }

  toggleCart() {
    this.isShowCart = !this.isShowCart;
  }
}
