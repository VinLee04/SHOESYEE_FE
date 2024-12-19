import { Component, input, OnInit, output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from '../../common/image-upload/image-upload.component';
import { Product, ProductManagementAddEditService } from './product-management-add-edit.service';
import { Router, RouterModule } from '@angular/router';
import { Brand, Category, Color, Discount } from '../../interface/permanent';
import { brands, categories, colors, discounts } from '../../common/service/mock-data';

interface SizeDetail {
  size: string;
  isActive: boolean;
  quantity: number;
  price: number;
}

interface CreateProductRequest {
  name: string;
  brandId: string;
  categoryId: string;
  basicPrice: number;
  price: number;
  description: string;
  isActive: boolean;
  discountId: string | null;
  stock: number;
  productColors: Array<{
    colorId: string;
    sizes: Array<{
      size: string;
      quantity: number;
      price: number;
      isActive: boolean;
    }>;
  }>;
}


@Component({
  selector: 'app-product-management-add-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ImageUploadComponent,
    RouterModule,
  ],
  templateUrl: './product-management-add-edit.component.html',
  styleUrl: './product-management-add-edit.component.scss',
})
export class ProductManagementAddEditComponent implements OnInit {
  productForm!: FormGroup;
  brands: Brand[] = brands;
  categories: Category[] = categories;
  colors: Color[] = colors;
  discounts: Discount[] = discounts;

  thumbnailFile?: File;
  colorImages: { [key: number]: File } = {};
  editingColorIndex: number | null = null;

  // Available sizes configuration
  availableSizes: string[] = Array.from({ length: 11 }, (_, i) =>
    (i + 35).toString()
  );

  selectedSizes: Set<string> = new Set();
  colorSizeDetails: Map<number, Map<string, SizeDetail>> = new Map();

  constructor(
    private fb: FormBuilder,
    private productService: ProductManagementAddEditService,
    private router: Router
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadInitialData();
  }

  private createForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      brandId: ['', Validators.required],
      categoryId: ['', Validators.required],
      basicPrice: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      isActive: [true],
      discountId: [''],
      stock: [0],
      productColors: this.fb.array([]),
    });

    this.productForm.get('price')?.valueChanges.subscribe((value) => {
      this.updateAllSizePrices(value);
    });
  }

  private updateAllSizePrices(price: number) {
    this.colorSizeDetails.forEach((sizeMap) => {
      sizeMap.forEach((detail) => {
        if (detail.price === 0 || !detail.price) {
          detail.price = price;
        }
      });
    });
  }

  private loadInitialData() {
    // this.loadColors();
    // this.loadDiscounts();
  }

  // Color Management
  get productColors(): FormArray {
    return this.productForm.get('productColors') as FormArray;
  }

  private createColorFormGroup(): FormGroup {
    return this.fb.group({
      colorId: ['', Validators.required],
      img: [''],
    });
  }

  addProductColor() {
    const newIndex = this.productColors.length;
    this.productColors.push(this.createColorFormGroup());

    const newSizeMap = new Map<string, SizeDetail>();
    const price = this.productForm.get('price')?.value || 0;

    this.selectedSizes.forEach((size) => {
      newSizeMap.set(size, {
        size,
        isActive: true,
        quantity: 0,
        price: price,
      });
    });

    this.colorSizeDetails.set(newIndex, newSizeMap);
  }

  editColor(index: number) {
    this.editingColorIndex = this.editingColorIndex === index ? null : index;
  }

  removeColor(index: number) {
    const oldColorSizeDetails = new Map(this.colorSizeDetails);
    const oldColorImages = { ...this.colorImages };

    this.productColors.removeAt(index);

    const newColorSizeDetails = new Map<number, Map<string, SizeDetail>>();
    const newColorImages: { [key: number]: File } = {};

    this.productColors.controls.forEach((_, newIndex) => {
      if (newIndex < index) {
        newColorSizeDetails.set(newIndex, oldColorSizeDetails.get(newIndex)!);
        if (oldColorImages[newIndex]) {
          newColorImages[newIndex] = oldColorImages[newIndex];
        }
      } else {
        newColorSizeDetails.set(
          newIndex,
          oldColorSizeDetails.get(newIndex + 1)!
        );
        if (oldColorImages[newIndex + 1]) {
          newColorImages[newIndex] = oldColorImages[newIndex + 1];
        }
      }
    });

    this.colorSizeDetails = newColorSizeDetails;
    this.colorImages = newColorImages;

    if (this.editingColorIndex !== null) {
      if (this.editingColorIndex === index) {
        this.editingColorIndex = null;
      } else if (this.editingColorIndex > index) {
        this.editingColorIndex--;
      }
    }

    const newStock = this.calculateTotalStock();
    this.productForm.patchValue({ stock: newStock }, { emitEvent: false });
  }

  toggleSize(size: string) {
    if (this.selectedSizes.has(size)) {
      this.selectedSizes.delete(size);
      this.colorSizeDetails.forEach((sizeMap) => {
        sizeMap.delete(size);
      });
    } else {
      this.selectedSizes.add(size);
      const price = this.productForm.get('price')?.value || 0;
      this.colorSizeDetails.forEach((sizeMap) => {
        sizeMap.set(size, {
          size,
          isActive: true,
          quantity: 0,
          price: price,
        });
      });
    }
  }

  addCustomSize(input: HTMLInputElement) {
    const size = input.value.trim();
    if (size && !this.availableSizes.includes(size)) {
      const numericSize = Number(size);

      if (!isNaN(numericSize)) {
        this.availableSizes.push(size);
        this.toggleSize(size);
      }
    }
  }

  getSizeDetailsForColor(colorIndex: number): SizeDetail[] {
    const sizeMap = this.colorSizeDetails.get(colorIndex);
    return sizeMap ? Array.from(sizeMap.values()) : [];
  }

  private calculateTotalStock(): number {
    let total = 0;
    this.colorSizeDetails.forEach((sizeMap) => {
      sizeMap.forEach((detail) => {
        total += detail.quantity;
      });
    });
    return total;
  }

  // Event Handlers
  onThumbnailSelected(file: File) {
    this.thumbnailFile = file;
  }

  onThumbnailRemoved() {
    this.thumbnailFile = undefined;
  }

  // getColorLabel(colorForm: AbstractControl): string {
  //   const colorId = colorForm.get('colorId')?.value;
  //   const colorName = this.colors.find((c) => c.id === colorId)?.name;
  //   return `Image for ${colorName || 'color'}`;
  // }

  getColorLabel(colorForm: AbstractControl): string {
    const colorId = colorForm.get('colorId')?.value;
    const color = this.colors.find((c) => c.id === Number(colorId));
    return `Image for ${color?.name || 'color'}`;
  }

  onColorImageSelected(file: File, colorIndex: number) {
    this.colorImages[colorIndex] = file;
    const colorForm = this.productColors.at(colorIndex);
    colorForm.patchValue({ img: file.name });
  }

  onColorImageRemoved(colorIndex: number) {
    delete this.colorImages[colorIndex];
    const colorForm = this.productColors.at(colorIndex);
    colorForm.patchValue({ img: '' });
  }

  onThumbnailSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.thumbnailFile = input.files[0];
    }
  }

  onColorImageSelect(event: Event, colorIndex: number) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.colorImages[colorIndex] = input.files[0];
      const colorForm = this.productColors.at(colorIndex);
      colorForm.patchValue({ img: input.files[0].name });
    }
  }

  editingQuantity: { [key: string]: number } = {};
  editingPrice: { [key: string]: number } = {};

  onQuantityChange(event: Event, colorIndex: number, size: string) {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value) || 0;
    value = Math.max(0, value);
    this.editingQuantity[`${colorIndex}-${size}`] = value;
  }

  onQuantityBlur(colorIndex: number, size: string) {
    const key = `${colorIndex}-${size}`;
    if (key in this.editingQuantity) {
      let value = this.editingQuantity[key];
      value = Math.max(0, value);
      this.updateColorSizeDetail(colorIndex, size, {
        quantity: value,
      });
      delete this.editingQuantity[key];
    }
  }

  onPriceChange(event: Event, colorIndex: number, size: string) {
    const input = event.target as HTMLInputElement;
    let value = parseFloat(input.value) || 0;
    // Ensure value is not negative
    value = Math.max(0, value);
    this.editingPrice[`${colorIndex}-${size}`] = value;
  }

  onPriceBlur(colorIndex: number, size: string) {
    const key = `${colorIndex}-${size}`;
    if (key in this.editingPrice) {
      let value = this.editingPrice[key];
      // Ensure value is not negative before updating
      value = Math.max(0, value);
      this.updateColorSizeDetail(colorIndex, size, {
        price: value,
      });
      delete this.editingPrice[key];
    }
  }

  updateColorSizeDetail(
    colorIndex: number,
    size: string,
    detail: Partial<SizeDetail>
  ) {
    const sizeMap = this.colorSizeDetails.get(colorIndex);
    if (sizeMap) {
      const currentDetail = sizeMap.get(size);
      if (currentDetail) {
        sizeMap.set(size, { ...currentDetail, ...detail });

        if ('quantity' in detail) {
          const oldStock = this.productForm.get('stock')?.value || 0;
          const newStock = this.calculateTotalStock();
          this.productForm.patchValue(
            { stock: newStock },
            { emitEvent: false }
          );

          console.log(`Stock updated: ${oldStock} → ${newStock}`);
        }
      }
    }
  }

  private prepareFormData(): FormData {
    const formData = new FormData();

    const productRequest: CreateProductRequest = {
      name: this.productForm.get('name')?.value,
      brandId: this.productForm.get('brandId')?.value,
      categoryId: this.productForm.get('categoryId')?.value,
      discountId: this.productForm.get('discountId')?.value,
      basicPrice: this.productForm.get('basicPrice')?.value,
      price: this.productForm.get('price')?.value,
      description: this.productForm.get('description')?.value,
      isActive: this.productForm.get('isActive')?.value,
      stock: this.productForm.get('stock')?.value,
      productColors: [],
    };

    this.colorSizeDetails.forEach((sizeMap, colorIndex) => {
      const colorControl = this.productColors.at(colorIndex);
      const colorId = colorControl.get('colorId')?.value;

      const colorData = {
        colorId: colorId,
        sizes: Array.from(sizeMap.values()).map((detail) => ({
          size: detail.size,
          quantity: detail.quantity,
          price: detail.price,
          isActive: detail.isActive,
        })),
      };

      productRequest.productColors.push(colorData);
    });

    formData.append('data', JSON.stringify(productRequest));

    if (this.thumbnailFile) {
      formData.append('thumbnail', this.thumbnailFile);
    }

    Object.values(this.colorImages).forEach((file) => {
      formData.append('colorImages', file);
    });

    return formData;
  }

  onSubmit() {
    if (
      this.productForm.valid &&
      this.selectedSizes.size > 0 &&
      this.productColors.length > 0
    ) {
      const formData = this.prepareFormData();

      if (!this.thumbnailFile) {
        console.error('Thumbnail image is required');
        return;
      }

      if (Object.keys(this.colorImages).length !== this.productColors.length) {
        console.error('Each color must have an image');
        return;
      }

      this.productService.createProduct(formData).subscribe({
        next: (response) => {
          console.log('Product created successfully', response);
          this.resetForm(); // Call resetForm after successful creation
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error creating product', error);
        },
      });
    } else {
      this.markFormGroupTouched(this.productForm);
    }
  }

  private resetForm() {
    // Reset the main form with empty values
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      brandId: ['', Validators.required],
      categoryId: ['', Validators.required],
      basicPrice: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      isActive: [true],
      discountId: [''],
      stock: [0],
      productColors: this.fb.array([]),
    });

    // Reset file-related data
    this.thumbnailFile = undefined;
    this.colorImages = {};

    // Reset size selections
    this.selectedSizes.clear();
    this.colorSizeDetails.clear();
    this.editingColorIndex = null;

    // Reset editing states
    this.editingQuantity = {};
    this.editingPrice = {};

    // Re-subscribe to price changes
    this.productForm.get('price')?.valueChanges.subscribe((value) => {
      this.updateAllSizePrices(value);
    });
  }

  getTotalQuantityForColor(colorIndex: number): number {
    let total = 0;
    const sizeMap = this.colorSizeDetails.get(colorIndex);
    if (sizeMap) {
      sizeMap.forEach((detail) => {
        total += detail.quantity;
      });
    }
    return total;
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
      control.markAsTouched();
    });
  }

  private loadColors() {
    this.productService.getColors().subscribe({
      next: (colors) => (this.colors = colors),
      error: (error) => console.error('Error loading colors', error),
    });
  }

  private loadDiscounts() {
    this.productService.getDiscounts().subscribe({
      next: (discounts) => (this.discounts = discounts),
      error: (error) => console.error('Error loading discounts', error),
    });
  }
}