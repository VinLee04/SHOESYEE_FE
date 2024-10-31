import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-management-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-management-add.component.html',
  styleUrl: './product-management-add.component.scss',
})
export class ProductManagementAddComponent {
  clientForm: FormGroup;
  countries: string[] = ['United States', 'Canada', 'Mexico'];
  previewUrl: string | null = null;
  attachedFiles: File[] = [];

  constructor(private fb: FormBuilder) {
    this.clientForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      mobileNumber: [''],
      address: [''],
      country: [''],
      postalCode: [''],
      profileImage: [null],
      attachments: [[]],
      settings: this.fb.group({
        sendPaymentReminders: [false],
        chargeLateFeeds: [false],
        currencyLanguage: [false],
        invoiceAttachments: [false],
      }),
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.previewUrl = (e.target?.result as string) || null;
        this.clientForm.patchValue({
          profileImage: file,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeProfileImage(): void {
    this.previewUrl = null;
    this.clientForm.patchValue({
      profileImage: null,
    });
  }

  removeFile(index: number): void {
    this.attachedFiles.splice(index, 1);
    this.clientForm.patchValue({
      attachments: this.attachedFiles,
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      console.log(this.clientForm.value);
      // Handle form submission with files
    }
  }

  onCancel(): void {
    this.clientForm.reset();
    this.previewUrl = null;
    this.attachedFiles = [];
  }

  closeAdd = input<boolean>();
  closeAddChange = output<boolean>();
  
  close(){
    this.closeAddChange.emit(false);
  }
}