import { Component, inject } from '@angular/core';
import { AuthService } from '../../common/service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { API_URL_UPLOADS, environment } from '../../../environment';

@Component({
  selector: 'app-user-profile-edit',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './user-profile-edit.component.html',
  styleUrl: './user-profile-edit.component.scss',
})
export class UserProfileEditComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  profileForm!: FormGroup;
  userId: string = '';
  previewUrl: string | null = null;
  defaultAvatar: string | null = null;
  showFullscreen = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  hasNewImage = false;

  private readonly ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
  ];
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserData();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\+?[0-9]{10,12}$/)],
      ],
      gender: ['', Validators.required],
      birthdate: ['', Validators.required],
      address: ['', Validators.required],
      image: [null],
    });
  }

  private loadUserData(): void {
    this.auth
      .getCurrentUser()
      .pipe(take(1))
      .subscribe({
        next: (user) => {
          if (user) {
            this.userId = user.id;
            this.profileForm.patchValue({
              username: user.username,
              email: user.email,
              phone: user.phone,
              gender: user.gender,
              birthdate: this.formatDate(user.birthdate),
              address: user.address,
            });
            this.previewUrl = `${API_URL_UPLOADS}/${user.image ? user.image : 'avatars/default.png'}` || null;
            this.defaultAvatar = `${API_URL_UPLOADS}/${user.image ? user.image : 'avatars/default.png'}` || null;
          }
        },
        error: (error) => {
          this.errorMessage =
            'Failed to load user data. Please try again later.';
          console.error('Error loading user data:', error);
        },
      });
  }

  private formatDate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.profileForm.get(fieldName);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    if (errors['required']) return `${fieldName} is required`;
    if (errors['email']) return 'Invalid email format';
    if (errors['minlength'])
      return `${fieldName} must be at least ${errors['minlength'].requiredLength} characters`;
    if (errors['pattern']) return 'Invalid phone number format';

    return 'Invalid field';
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (!this.ALLOWED_FILE_TYPES.includes(file.type)) {
      this.errorMessage =
        'Invalid file type. Please upload a JPEG, PNG, or GIF image.';
      return;
    }

    if (file.size > this.MAX_FILE_SIZE) {
      this.errorMessage = 'File size exceeds 5MB limit.';
      return;
    }

    this.profileForm.patchValue({ image: file });

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
      this.hasNewImage = true;
      this.errorMessage = '';
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.previewUrl = this.defaultAvatar;
    this.hasNewImage = false;
    this.profileForm.patchValue({ image: null });
    // Reset file input
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  toggleImagePreview(): void {
    if (this.previewUrl) {
      this.showFullscreen = !this.showFullscreen;
      document.body.style.overflow = this.showFullscreen ? 'hidden' : 'auto';
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    const formValue = this.profileForm.value;

    // Append all form fields except avatar
    Object.keys(formValue).forEach((key) => {
      if (
        key !== 'image' &&
        formValue[key] !== null &&
        formValue[key] !== undefined
      ) {
        if(key === 'gender'){ 
          formData.append(key, formValue[key] === 'Male' ? 'true' : 'false');
        }else{
          formData.append(key, formValue[key]);
        }
      }
    });

    if (this.hasNewImage && formValue.image) {
      formData.append('image', formValue.image);
    }

    this.auth.updateUserInfo(this.userId ,formData).subscribe({
      next: (response) => {
        this.successMessage = 'Profile updated successfully!';
        this.isSubmitting = false;
        if (response.result.image) {
          this.defaultAvatar = response.result.image;
        }
        this.hasNewImage = false;
        this.loadUserData();
        setTimeout(() => {
          this.router.navigate(['/user-profile']);
        }, 2000);
      },
    });
  }

  navigateToChangePassword(): void {
    this.router.navigate(['/change-password']);
  }

  logout(): void {
    this.auth.logout();
  }

  // Cleanup when component is destroyed
  ngOnDestroy(): void {
    // Reset body overflow in case component is destroyed while fullscreen is active
    document.body.style.overflow = 'auto';
  }
}