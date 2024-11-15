import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import {  FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccessManagementService } from '../../access-management/access-management.service';
import { NavService } from '../../management-navbar/nav.service';

@Component({
  selector: 'app-user-management-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-management-filter.component.html',
  styleUrl: './user-management-filter.component.scss',
})
export class UserManagementFilterComponent {
  filterForm: FormGroup;
  roles: string[] = [];
  closeFilter = input<boolean>();
  closeFilterChange = output<boolean>();
  initialValues: any = input<any>();
  filterApplied: any = output<any>();

  constructor(private accessService: AccessManagementService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      email: [''],
      phone: [''],
      role: [''],
      gender: [''],
      status: ['true'],
    });
    
    this.accessService.getRoleNames().subscribe((response) => {
      this.roles = response;
    });
  }

  ngOnInit() {
    if (this.initialValues()) {
      this.filterForm.patchValue({
        email: this.initialValues().email || '',
        phone: this.initialValues().phone || '',
        role: this.initialValues().role || '',
        gender:
          this.initialValues().gender !== null &&
          this.initialValues().gender !== undefined
            ? this.initialValues().gender
            : '',
        status:
          this.initialValues().status !== null &&
          this.initialValues().status !== undefined
            ? this.initialValues().status
            : '',
      });
    }
  }

  navService = inject(NavService);

  close() {
    this.navService.navSignal.set(true);
    this.closeFilterChange.emit(false);
  }

  applyFilter() {
    const filterValues = this.filterForm.value;
    this.filterApplied.emit(filterValues);
    this.close();
  }

  clearFilter() {
    this.filterForm.reset({
      email: '',
      phone: '',
      role: '',
      gender: '',
      status: 'true',
    });
  }
}
