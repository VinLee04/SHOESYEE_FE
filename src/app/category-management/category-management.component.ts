import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CategoryAllData, CategoryService } from '../common/service/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss',
})
export class CategoryManagementComponent implements OnInit {
  categoryForm!: FormGroup;
  categories!: CategoryAllData[];
  selectedCategory: CategoryAllData | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadCategories();
  }

  private loadCategories() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = this.mapData(categories);
    });
  }

  private mapData(categories: CategoryAllData[]): CategoryAllData[] {
    return categories.map((category) => {
      category.name = category.name.toUpperCase();
      return category;
    });
  }

  initForm() {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      isActive: [true],
    });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const formValue = this.categoryForm.value;
      const categoryData: CategoryAllData = {
        id: this.selectedCategory?.id,
        name: formValue.name,
        isActive: formValue.isActive || false,
      };

      if (this.selectedCategory) {
        this.updateCategory(categoryData);
      } else {
        this.createCategory(categoryData);
      }
      this.resetForm();
    }
  }

  private createCategory(categoryData: CategoryAllData) {
    this.categoryService.createCategory(categoryData).subscribe(() => {
      this.loadCategories();
    });
  }

  private updateCategory(categoryData: CategoryAllData) {
    this.categoryService.updateCategory(categoryData).subscribe(() => {
      this.loadCategories();
    });
  }

  resetForm() {
    this.selectedCategory = null;
    this.categoryForm.reset();
  }

  editCategory(category: CategoryAllData) {
    this.selectedCategory = category;
    this.categoryForm.patchValue(category);
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe(() => {
      this.loadCategories();
    });
  }

  restoreCategory(id: number) {
    this.categoryService.restoreCategory(id).subscribe(() => {
      this.loadCategories();
    });
  }
}