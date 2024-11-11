import { Component, inject } from '@angular/core';
import { AuthService } from '../../common/service/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-feature-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './customer-feature-nav.component.html',
  styleUrl: './customer-feature-nav.component.scss',
})
export class CustomerFeatureNavComponent {
  authService = inject(AuthService);

  signOut() {
    this.authService.logout();
  }
}
