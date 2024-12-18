import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { BrandAllData, BrandService } from './brand.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brand-management',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './brand-management.component.html',
  styleUrl: './brand-management.component.scss',
})
export class BrandManagementComponent implements OnInit {
  brandForm!: FormGroup;
  brands$: Observable<BrandAllData[]>;
  selectedBrand: BrandAllData | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private brandService: BrandService
  ) {
    this.brands$ = this.brandService.getBrandManagement();
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.brandForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      logo: [''],
      url: [''],
      isActive: [true],
    });
  }

  onSubmit() {
    if (this.brandForm.valid) {
      if (this.selectedBrand) {
        this.updateBrand();
      } else {
        this.createBrand();
      }
      this.resetForm();
    }
  }

  private createBrand() {
    this.brandService.createBrand(this.brandForm.value).subscribe(() => {
      this.brands$.subscribe((brands) => {
        // Update the brands list
      });
    });
  }

  private updateBrand() {
    this.brandService
      .updateBrand(this.selectedBrand!.id, this.brandForm.value)
      .subscribe(() => {
        this.brands$.subscribe((brands) => {
          // Update the brands list
        });
      });
  }

  resetForm() {
    this.selectedBrand = null;
    this.brandForm.reset();
  }

  editBrand(brand: BrandAllData) {
    this.selectedBrand = brand;
    this.brandForm.patchValue(brand);
    console.table(this.selectedBrand);
  }

  deleteBrand(id: number) {
    this.brandService.deleteBrand(id).subscribe(() => {
      this.brands$.subscribe((brands) => {
        // Update the brands list
      });
    });
  }

  restoreBrand(id: number) {
    this.brandService.restoreBrand(id).subscribe(() => {
      this.brands$.subscribe((brands) => {
        // Update the brands list
      });
    });
  }
}