import { CommonModule } from '@angular/common';
import { Component, DestroyRef, effect, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role } from '../../interface/Access';
import { UserService } from '../user.service';
import { AccessManagementService } from '../../access-management/access-management.service';
import { API_URL_UPLOADS } from '../../../environment';
import { NavService } from '../../management-navbar/nav.service';

@Component({
  selector: 'app-user-management-add-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-management-add-edit.component.html',
  styleUrl: './user-management-add-edit.component.scss',
})
export class UserManagementAddEditComponent implements OnInit {
  show = input<boolean>();
  showChange = output<boolean>();
  editMode = input<boolean>(false);
  userData = input<any>(null);

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private accessService = inject(AccessManagementService);
  private destroyRef = inject(DestroyRef);

  clientForm!: FormGroup;
  previewUrl: string | null = null;
  defaultUrl: string | null = null;
  selectedFile: File | null = null;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  roles: Role[] = [];

  private readonly ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
  ];
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024;

  constructor() {
    // Effect để theo dõi show input
    effect(() => {
      if (this.show()) {
        this.resetToDefault();
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadRoles();

    if (this.editMode() && this.userData()) {
      this.populateForm(this.userData());
    }
  }

  private resetToDefault(): void {
    if (this.userData()) {
      this.defaultUrl = this.userData().image
        ? `${API_URL_UPLOADS}/${this.userData().image}`
        : null;
      this.previewUrl = null;
      this.selectedFile = null;
    }
  }

  private initializeForm(): void {
    const baseFormControls = {
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+?[0-9]{10,12}$/)]],
      birthdate: [''],
      salary: ['', [Validators.pattern(/^\d+$/)]],
      address: [''],
      gender: [true],
      isActive: [true],
      roleId: ['', Validators.required],
    };

    if (!this.editMode()) {
      Object.assign(baseFormControls, {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      });
    }

    this.clientForm = this.fb.group(baseFormControls, {
      validators: this.editMode() ? null : this.passwordMatchValidator,
    });
  }

  private populateForm(userData: any): void {
     let formattedDate = '';
     if (userData.birthdate && Array.isArray(userData.birthdate)) {
       const [year, month, day] = userData.birthdate;
       // Pad month and day with leading zeros if needed
       formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day
         .toString()
         .padStart(2, '0')}`;
     }

    if (!userData) return;

    this.defaultUrl = userData.image
      ? `${API_URL_UPLOADS}/${userData.image}`
      : null;

    this.clientForm.patchValue({
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
      birthdate: formattedDate,
      salary: userData.salary,
      address: userData.address,
      gender:
        userData.gender == 'Male'
          ? true
          : userData.gender == 'FeMale'
          ? false
          : '',
      isActive: userData.active,
      roleId: userData.role,
    });

    console.log("ceck", userData.birthdate);
  }

  

  onFileSelected(event: Event): void {
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

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result as string;
      this.errorMessage = '';
    };
    reader.readAsDataURL(file);
  }

  removeProfileImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  getCurrentImageUrl(): string {
    return this.previewUrl || this.defaultUrl || '';
  }

  onSubmit(): void {
    if (this.clientForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    const formValue = this.clientForm.value;

    Object.keys(formValue).forEach((key) => {
      if (formValue[key] !== null && formValue[key] !== undefined) {
        formData.append(key, formValue[key]);
      }
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const request$ = this.editMode()
      ? this.userService.updateStaff(this.userData().id, formData)
      : this.userService.createStaff(formData);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = `Staff ${
            this.editMode() ? 'updated' : 'created'
          } successfully!`;
          this.showChange.emit(false);
          if (!this.editMode()) {
            this.resetForm();
          }
        }
      },
      error: (error) => {
        this.errorMessage = error.message || 'An error occurred';
        this.isSubmitting = false;
      },
      complete: () => (this.isSubmitting = false),
    });
  }

  private resetForm(): void {
    this.clientForm.reset({
      gender: true,
      isActive: true,
    });
    this.resetToDefault();
  }

  private loadRoles(): void {
    this.accessService
      .getRoles()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => (this.roles = response),
      });
  }

  // removeProfileImage(): void {
  //   this.selectedFile = null;
  //   this.previewUrl = null;
  //   const fileInput = document.querySelector(
  //     'input[type="file"]'
  //   ) as HTMLInputElement;
  //   if (fileInput) {
  //     fileInput.value = '';
  //   }
  // }

  // onSubmit(): void {
  //   console.log('Form validity:', this.clientForm.valid);
  //   console.log('Form errors:', this.clientForm.errors);
  //   console.log('Form value:', this.clientForm.value);

  //   if (this.clientForm.invalid || this.isSubmitting) {
  //     console.log('Form is invalid or submitting');
  //     return;
  //   }

  //   this.isSubmitting = true;
  //   this.errorMessage = '';
  //   this.successMessage = '';

  //   const formData = new FormData();
  //   const formValue = this.clientForm.value;

  //   Object.keys(formValue).forEach((key) => {
  //     if (
  //       // key !== 'confirmPassword' &&
  //       formValue[key] !== null &&
  //       formValue[key] !== undefined
  //     ) {
  //       formData.append(key, formValue[key]);
  //     }
  //   });

  //   if (this.selectedFile) {
  //     formData.append('image', this.selectedFile);
  //   }

  //   this.userService.createStaff(formData).subscribe({
  //     next: (response) => {
  //       if (response.success) {
  //         this.successMessage = 'Staff created successfully!';
  //         this.showChange.emit(false);
  //         this.resetForm();
  //         this.isSubmitting = false;
  //       }
  //     },
  //     complete: () => (this.isSubmitting = false),
  //   });
  // }


  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.clientForm.get(fieldName);
    if (!control || !control.errors) return '';

    const errors = control.errors;

    if (errors['required']) return `${fieldName} is required`;
    if (errors['email']) return 'Invalid email format';
    if (errors['pattern']) {
      if (fieldName === 'phone') return 'Invalid phone number format';
      if (fieldName === 'salary') return 'Salary must be a number';
    }
    if (errors['minlength'])
      return `${fieldName} must be at least ${errors['minlength'].requiredLength} characters`;
    if (errors['inUse']) return 'Username is already in use';
    if (errors['existed']) return 'Email already exists';
    if (errors['mismatch']) return 'Passwords do not match';

    return 'Invalid field';
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onCancel(): void {
    this.resetForm();
    this.showChange.emit(false);
  }

  navService = inject(NavService);

  close(): void {
    this.navService.navSignal.set(true);
    this.showChange.emit(false);
  }

  showFullscreen = false;

  // ... các methods hiện có ...

  toggleImagePreview(): void {
    if (this.previewUrl || this.defaultUrl) {
      this.showFullscreen = !this.showFullscreen;
    }
  }

}