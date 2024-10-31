import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { ManagementNavbarComponent } from './management-navbar/management-navbar.component';
import { AuthService } from './common/service/auth.service';
import { NotificationComponent } from './notification/notification.component';
import { AccessManagementComponent } from './access-management/access-management.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ChangePasswordComponent } from './user-profile/change-password/change-password.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HomeComponent, FooterComponent, ManagementNavbarComponent , NotificationComponent,
    AccessManagementComponent, ResetPasswordComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'SHOESYEE-WEB-PROJECT';
  auth = inject(AuthService);
  show = true;
}
