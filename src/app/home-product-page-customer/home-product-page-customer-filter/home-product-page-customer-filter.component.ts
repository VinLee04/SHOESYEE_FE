import { CommonModule } from '@angular/common';
import { Component, HostListener, input, model, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeProductPageCustomerService } from '../home-product-page-customer.service';
import { FilterState } from '../home-product-page-customer.component';
import { FilterService } from './home-product-page-customer-fiter.service';
import { BrandAllData, BrandService } from '../../common/service/brand.service';
import { CategoryService } from '../../common/service/category.service';

@Component({
  selector: 'app-home-product-page-customer-filter',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './home-product-page-customer-filter.component.html',
  styleUrl: './home-product-page-customer-filter.component.scss',
})
export class HomeProductPageCustomerFilterComponent {
  filterForm: FormGroup;
  colors: string[] = ['Red', 'Blue', 'Green'];
  categories: string[] = [
    'All',
    'Men',
    'Women',
    'Running',
    'Basketball',
    'Training',
    'Lifestyle',
    'Soccer',
    'Tennis',
    'Walking',
    'Dance',
  ];
  discounts: number[] = [10, 20, 30, 15, 25];
  brands!: BrandAllData[];

  closeFilter() {
    this.filterService.toggleFilter();
  }

  activeDropdown: string | null = null;

  initialValues: any = input<any>();
  filterApplied = output<FilterState>();

  constructor(
    private fb: FormBuilder,
    private productService: HomeProductPageCustomerService,
    private filterService: FilterService,
    private brandService: BrandService,
    private categoryService: CategoryService,
  ) {
    this.filterForm = this.fb.group({
      categories: [[]],
      colors: [[]],
      priceMin: [0],
      priceMax: [0],
      discounts: [[]],
      brands: [],
    });

    this.productService.getDiscounts().subscribe((response) => {
      this.discounts = response;
    });

  }

  ngOnInit() {
    if (this.initialValues()) {
      // Xử lý initialValues - chuyển từ string sang array nếu cần
      const categories = this.initialValues().categories
        ? typeof this.initialValues().categories === 'string'
          ? this.initialValues().categories.split(',')
          : this.initialValues().categories
        : [];

      // const colors = this.initialValues().colors
      //   ? typeof this.initialValues().colors === 'string'
      //     ? this.initialValues().colors.split(',')
      //     : this.initialValues().colors
      //   : [];

      const discounts = this.initialValues().discounts
        ? typeof this.initialValues().discounts === 'string'
          ? this.initialValues().discounts.split(',').map(Number)
          : this.initialValues().discounts
        : [];

      const brands = this.initialValues().brands
        ? typeof this.initialValues().brands === 'string'
          ? this.initialValues().brands.split(',')
          : this.initialValues().brands
        : [];

      this.filterForm.patchValue({
        categories: categories,
        // colors: colors,
        priceMin: this.initialValues().priceRange?.min || 0,
        priceMax: this.initialValues().priceRange?.max || 0,
        discounts: discounts,
        brands: brands,
      });

      this.brands = this.brandService.getBrands()();
      this.categoryService
        .getCategories()
        .subscribe((response:any) => this.categories = response.name);
    }
  }
  
  applyFilter() {
    // Lấy giá trị hiện tại của form
    const formValues = this.filterForm.getRawValue();

    // Tạo đối tượng FilterState với các giá trị đã chuyển đổi sang string
    const filterValues: FilterState = {
      categories: this.getSelectedCategories().join(','),
      colors: this.getSelectedColors().join(','),
      priceRange: {
        min: formValues.priceMin,
        max: formValues.priceMax,
      },
      discounts: this.getSelectedDiscounts().join(','),
      brands: this.getSelectedBrands().join(','),
    };

    // Log để debug
    console.log('Applying filters:', filterValues);

    // Emit giá trị đã chuyển đổi
    this.filterApplied.emit(filterValues);
  }

  getSelectedBrands(): string[] {
    return this.filterForm.get('brands')?.value || [];
  }

  getSelectedCategories(): string[] {
    return this.filterForm.get('categories')?.value || [];
  }

  getSelectedColors(): string[] {
    return this.filterForm.get('colors')?.value || [];
  }

  getSelectedDiscounts(): number[] {
    return this.filterForm.get('discounts')?.value || [];
  }

  // Các phương thức khác giữ nguyên
  clearFilter() {
    this.filterForm.reset({
      categories: [],
      colors: [],
      priceMin: 0,
      priceMax: 0,
      discounts: [],
      brands: [],
    });
    this.applyFilter();
  }

  toggleCategory(category: string) {
    const currentCategories = this.getSelectedCategories();
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((c: string) => c !== category)
      : [...currentCategories, category];
    this.filterForm.patchValue({ categories: newCategories });
  }

  toggleColor(color: string) {
    const currentColors = this.getSelectedColors();
    const newColors = currentColors.includes(color)
      ? currentColors.filter((c: string) => c !== color)
      : [...currentColors, color];
    this.filterForm.patchValue({ colors: newColors });
  }

  toggleDiscount(discount: number) {
    const currentDiscounts = this.getSelectedDiscounts();
    const newDiscounts = currentDiscounts.includes(discount)
      ? currentDiscounts.filter((d: number) => d !== discount)
      : [...currentDiscounts, discount];
    this.filterForm.patchValue({ discounts: newDiscounts });
  }

  toggleBrand(brand: string) {
    const currentBrands = this.getSelectedBrands();
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter((b: string) => b !== brand)
      : [...currentBrands, brand];
    this.filterForm.patchValue({ brands: newBrands });
  }

  // Các phương thức kiểm tra selection
  isCategorySelected(category: string): boolean {
    return this.getSelectedCategories().includes(category);
  }

  isColorSelected(color: string): boolean {
    return this.getSelectedColors().includes(color);
  }

  isDiscountSelected(discount: number): boolean {
    return this.getSelectedDiscounts().includes(discount);
  }

  isBrandSelected(brand: string): boolean {
    return this.getSelectedBrands().includes(brand);
  }

  toggleDropdown(dropdown: string) {
    this.activeDropdown = this.activeDropdown === dropdown ? null : dropdown;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const dropdownElements = document.querySelectorAll('.dropdown-container');
    let clickedInside = false;

    dropdownElements.forEach((element) => {
      if (element.contains(event.target as Node)) {
        clickedInside = true;
      }
    });

    if (!clickedInside) {
      this.activeDropdown = null;
    }
  }
}