import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../common/service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class ForgotPasswordComponent implements OnInit{
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  step: 'email' | 'code' | 'newPassword' = 'email';
ngOnInit(): void {
    this.authService.scrollToTop();
}
  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    code: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  onSubmitEmail() {
    const emailControl = this.forgotPasswordForm.get('email');

    if (emailControl?.valid) {
      const email = emailControl.value;

      if (!email) {
        console.error('Email is missing');
        return;
      }

      this.authService.sendPasswordResetEmail(email).subscribe(
        () => {
          this.step = 'code';
          console.log('Password reset email sent successfully');
        },
        (error) => {
          console.error('Failed to send reset email', error);
        }
      );
    } else {
      console.error('Email is invalid or missing');
    }
  }

  onSubmitCode() {
    const codeControl = this.forgotPasswordForm.get('code');
    if (codeControl?.valid) {
      const code = codeControl?.value;

      if (!code) {
        console.error('Reset code is missing');
        return;
      }

      this.authService.verifyResetCode(code).subscribe(
        () => {
          this.step = 'newPassword';
          console.log('Reset code verified successfully');
        },
        (error) => {
          console.error('Invalid reset code', error);
        }
      );
    } else {
      console.error('Reset code is invalid or missing');
    }
  }

  onSubmitNewPassword() {
    if (this.forgotPasswordForm.valid) {
      const newPassword = this.forgotPasswordForm.get('newPassword')?.value;
      const confirmPassword =
        this.forgotPasswordForm.get('confirmPassword')?.value;
      const code = this.forgotPasswordForm.get('code')?.value;

      if (newPassword !== confirmPassword) {
        console.error('Passwords do not match');
        return;
      }

      if (!newPassword || !code) {
        console.error('New password or code is missing');
        return;
      }

      this.authService.resetPassword(code, newPassword).subscribe(
        () => {
          // Password reset successful, navigate to login
          // Inject Router here to handle navigation
        },
        (error) => {
          console.error('Failed to reset password', error);
        }
      );
    }
  }
}
