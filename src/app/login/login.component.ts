import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../common/service/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
})
export class LoginComponent implements OnInit {
  auth = inject(AuthService);
  fb = inject(FormBuilder);
  showPassword = false;

  constructor(private router: Router, private CallAPI: AuthService) {}

  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit(): void {
    this.CallAPI.scrollToTop();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.getRawValue()).subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate([
              this.auth.isNotStaff() ? '/home' : '/management/users',
            ]);
          }
        },
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
