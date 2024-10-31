import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ResetPasswordService } from './reset-password.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ResetPasswordForm, VerifyCodeRequest } from '../interface/Password';

type ResetStep = 'email' | 'codeAndPassword';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private resetPasswordService = inject(ResetPasswordService);

  step: ResetStep = 'email';
  isLoading = false;
  remainingAttempts: number | null = null;
  blockTime = '';
  showPassword = false;

  resetForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    code: ['', [Validators.required, Validators.minLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]], // Dùng để xác nhận mật khẩu ở phía client
  }) as FormGroup;

  ngOnInit(): void {
    this.resetPasswordService.blockTime$
      .pipe(takeUntil(this.destroy$))
      .subscribe((time) => {
        this.blockTime = time;
        if (time) {
          this.resetForm.get('email')?.disable();
        } else {
          this.resetForm.get('email')?.enable();
        }
      });
  }

  backToSendEmail(){
    this.step = 'email';
    this.resetForm.get('email')?.setValue("");
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (
      (this.step === 'email' && this.resetForm.get('email')?.invalid) ||
      (this.step === 'codeAndPassword' && this.isNewPasswordInvalid()) ||
      this.isLoading
    )
      return;

    this.isLoading = true;

    const formData: VerifyCodeRequest = {
      email: this.resetForm.get('email')?.value || '',
      code: this.resetForm.get('code')?.value || '',
      newPassword: this.resetForm.get('newPassword')?.value || '',
    };

    switch (this.step) {
      case 'email':
        this.handleEmailSubmit(formData.email);
        break;
      case 'codeAndPassword':
        this.handlePasswordSubmit(formData);
        break;
    }
  }

  private isNewPasswordInvalid(): boolean {
    const newPassword = this.resetForm.get('newPassword')?.value;
    const confirmPassword = this.resetForm.get('confirmPassword')?.value;

    const isNewPasswordInvalid =
      this.resetForm.get('newPassword')?.invalid ?? false;

    return newPassword !== confirmPassword || isNewPasswordInvalid;
  }

  private handleEmailSubmit(email: string): void {
    this.resetPasswordService
      .requestPasswordReset(email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if(response){
            this.remainingAttempts = response.result.counter ?? null;
            this.step = 'codeAndPassword'; 
          }
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  private handlePasswordSubmit(formData: VerifyCodeRequest): void {
    const { code, newPassword } = formData;
    const email = this.resetForm.get('email')?.value; // Lấy email từ form
    if (!email) {
      console.error('Email is required');
      return;
    }

    this.resetPasswordService
      .verifyAndResetPassword({ email, code, newPassword })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          (response) ? this.router.navigate(['/login']) : "";
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getErrorMessage(controlName: keyof ResetPasswordForm): string {
    const control = this.resetForm.get(controlName);
    if (!control?.errors || !control.touched) return '';

    const errors = control.errors;
    if (errors['required']) return `${controlName} is required`;
    if (errors['email']) return 'Invalid email format';
    if (errors['minlength'])
      return `Minimum length is ${errors['minlength'].requiredLength}`;

    return 'Invalid input';
  }
}
