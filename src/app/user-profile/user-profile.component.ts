import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../common/service/auth.service';
import { API_URL_UPLOADS } from '../../environment';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ChangePasswordComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  auth = inject(AuthService);
  
  showChangePassword:boolean = false;

  // Sử dụng computed để tự động cập nhật khi currentUser thay đổi
  userImage = computed(() => {
    const user = this.auth.currentUser;
    return user?.image
      ? `${API_URL_UPLOADS}/${user.image}`
      : `${API_URL_UPLOADS}/avatars/default.png`;
  });
}
