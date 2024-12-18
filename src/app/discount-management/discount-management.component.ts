import { Component, OnInit } from '@angular/core';
import { DiscountAllData, DiscountService } from './discount.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-discount-management',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './discount-management.component.html',
  styleUrl: './discount-management.component.scss',
})
export class DiscountManagementComponent implements OnInit {
  discounts: DiscountAllData[] = [];
  discountForm: FormGroup;
  isLoading = false;
  formMode: 'create' | 'edit' = 'create';
  selectedDiscount: DiscountAllData | null = null;

  // Filter options
  filterOptions = [
    { label: 'All Discounts', value: 'all' },
    { label: 'Active Discounts', value: 'active' },
    { label: 'Inactive Discounts', value: 'inactive' },
    { label: 'Expired Discounts', value: 'expired' },
  ];
  selectedFilter = 'all';

  constructor(
    private discountService: DiscountService,
    private fb: FormBuilder
  ) {
    this.discountForm = this.fb.group({
      percent: [
        '',
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      startDay: ['', Validators.required],
      endDay: ['', Validators.required],
      comment: [''],
      isActive: [true],
    });
  }

  ngOnInit() {
    this.loadDiscounts();
  }

  loadDiscounts() {
    this.isLoading = true;
    this.discountService
      .getDiscounts()
      .pipe(
        catchError((error) => {
          console.error('Error loading discounts', error);
          return of([]);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe((discounts) => {
        this.discounts = this.filterDiscounts(discounts);
      });
  }

  filterDiscounts(discounts: DiscountAllData[]): DiscountAllData[] {
    const now = new Date();
    switch (this.selectedFilter) {
      case 'active':
        return discounts.filter((d) => d.isActive && new Date(d.endDay) > now);
      case 'inactive':
        return discounts.filter((d) => !d.isActive);
      case 'expired':
        return discounts.filter((d) => new Date(d.endDay) < now);
      default:
        return discounts;
    }
  }

  onSubmit() {
    if (this.discountForm.invalid) {
      return;
    }

    const discountData = this.discountForm.value;

    if (this.formMode === 'create') {
      this.createDiscount(discountData);
    } else {
      this.updateDiscount(discountData);
    }
  }

  createDiscount(discountData: DiscountAllData) {
    this.isLoading = true;
    this.discountService
      .createDiscount(discountData)
      .pipe(
        catchError((error) => {
          console.error('Error creating discount', error);
          return of(null);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe((newDiscount) => {
        if (newDiscount) {
          // Reload discounts to ensure latest data
          this.loadDiscounts();
          this.resetForm();
        }
      });
  }

  updateDiscount(discountData: DiscountAllData) {
    if (!this.selectedDiscount) return;

    this.isLoading = true;
    this.discountService
      .updateDiscount(this.selectedDiscount.id!, discountData)
      .pipe(
        catchError((error) => {
          console.error('Error updating discount', error);
          return of(null);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe((updatedDiscount) => {
        if (updatedDiscount) {
          const index = this.discounts.findIndex(
            (d) => d.id === updatedDiscount.id
          );
          if (index !== -1) {
            this.discounts[index] = updatedDiscount;
          }
          this.resetForm();
        }
      });
  }

  editDiscount(discount: DiscountAllData) {
    this.selectedDiscount = discount;
    this.formMode = 'edit';

    // Convert timestamps to datetime-local format
    const startDate = new Date(discount.startDay);
    const endDate = new Date(discount.endDay);

    this.discountForm.patchValue({
      ...discount,
      startDay: this.formatDateForInput(startDate),
      endDay: this.formatDateForInput(endDate),
    });
  }

  // Add this method to the component
  private formatDateForInput(date: Date): string {
    const pad = (num: number) => num.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  deleteDiscount(id: number) {
    this.isLoading = true;
    this.discountService
      .deleteDiscount(id)
      .pipe(
        catchError((error) => {
          console.error('Error deleting discount', error);
          return of(null);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(() => {
        this.loadDiscounts();
      });
  }

  restoreDiscount(id: number) {
    this.isLoading = true;
    this.discountService
      .restoreDiscount(id)
      .pipe(
        catchError((error) => {
          console.error('Error restoring discount', error);
          return of(null);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(() => {
        this.loadDiscounts();
      });
  }

  resetForm() {
    this.discountForm.reset({ isActive: true });
    this.formMode = 'create';
    this.selectedDiscount = null;
  }

  // Utility method to format date
  formatDate(dateString: number): string {
    return new Date(dateString).toLocaleDateString();
  }

  // Check if a discount is expired
  isExpired(discount: DiscountAllData): boolean {
    return new Date(discount.endDay) < new Date();
  }
}
