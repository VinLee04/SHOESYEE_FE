import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product, productService } from './product.service';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from '../common/image-upload/image-upload.component';

interface SizeDetail {
  size: string;
  isActive: boolean;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-product-tessss',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ImageUploadComponent],
  templateUrl: './product-tessss.component.html',
  styleUrl: './product-tessss.component.scss',
})
export class ProductTessssComponent implements OnInit {
  productForm!: FormGroup;
  colors: any[] = [];
  discounts: any[] = [];
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
    private productService: productService
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
      discountId: [null],
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

  // Color Management
  get productColors(): FormArray {
    return this.productForm.get('productColors') as FormArray;
  }

  get productDetails(): FormArray {
    return this.productForm.get('productDetails') as FormArray;
  }

  // Create new detail form group
  private createDetailFormGroup(): FormGroup {
    return this.fb.group({
      size: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]],
      price: ['', [Validators.required, Validators.min(0)]],
      isActive: [true], // Added explicitly
      selectedColorIds: this.fb.array([]),
    });
  }

  addProductDetail() {
    this.productDetails.push(this.createDetailFormGroup());
  }

  removeDetail(index: number) {
    this.productDetails.removeAt(index);

    // Remove this detail from all colors' selectedDetailIds
    this.productColors.controls.forEach((color) => {
      const selectedDetailIds = color.get('selectedDetailIds') as FormArray;
      const detailIdIndex = selectedDetailIds.controls.findIndex(
        (ctrl) => ctrl.value === index
      );
      if (detailIdIndex !== -1) {
        selectedDetailIds.removeAt(detailIdIndex);
      }
    });
  }

  // Color Management

  private createColorFormGroup(): FormGroup {
    return this.fb.group({
      colorId: ['', Validators.required],
      img: [''],
    });
  }

  private reorganizeColorSizeDetails() {
    const newColorSizeDetails = new Map<number, Map<string, SizeDetail>>();

    // Iterate through existing colors and rebuild the map with new indices
    this.productColors.controls.forEach((_, newIndex) => {
      // Find the corresponding old data
      const oldData = Array.from(this.colorSizeDetails.values())[newIndex];
      if (oldData) {
        newColorSizeDetails.set(newIndex, new Map(oldData));
      }
    });

    this.colorSizeDetails = newColorSizeDetails;
  }

  removeColor(index: number) {
    // 1. Lưu lại dữ liệu cũ trước khi xóa
    const oldColorSizeDetails = new Map(this.colorSizeDetails);
    const oldColorImages = { ...this.colorImages };

    // 2. Xóa từ FormArray
    this.productColors.removeAt(index);

    // 3. Tạo Map mới để lưu dữ liệu được tổ chức lại
    const newColorSizeDetails = new Map<number, Map<string, SizeDetail>>();
    const newColorImages: { [key: number]: File } = {};

    // 4. Duyệt qua tất cả các màu còn lại và tổ chức lại dữ liệu
    this.productColors.controls.forEach((_, newIndex) => {
      if (newIndex < index) {
        // Giữ nguyên dữ liệu cho các index trước vị trí xóa
        newColorSizeDetails.set(newIndex, oldColorSizeDetails.get(newIndex)!);
        if (oldColorImages[newIndex]) {
          newColorImages[newIndex] = oldColorImages[newIndex];
        }
      } else {
        // Di chuyển dữ liệu từ các index sau lên một bậc
        newColorSizeDetails.set(
          newIndex,
          oldColorSizeDetails.get(newIndex + 1)!
        );
        if (oldColorImages[newIndex + 1]) {
          newColorImages[newIndex] = oldColorImages[newIndex + 1];
        }
      }
    });

    // 5. Cập nhật lại state
    this.colorSizeDetails = newColorSizeDetails;
    this.colorImages = newColorImages;

    // 6. Reset editing index nếu cần
    if (this.editingColorIndex !== null) {
      if (this.editingColorIndex === index) {
        this.editingColorIndex = null;
      } else if (this.editingColorIndex > index) {
        this.editingColorIndex--;
      }
    }

    // 7. Cập nhật lại tổng stock
    const newStock = this.calculateTotalStock();
    this.productForm.patchValue({ stock: newStock }, { emitEvent: false });
  }

  // Update the addProductColor method to ensure proper initialization
  addProductColor() {
    const newIndex = this.productColors.length;
    this.productColors.push(this.createColorFormGroup());

    // Initialize size details for new color
    const newSizeMap = new Map<string, SizeDetail>();
    const price = this.productForm.get('price')?.value || 0;

    // Add all currently selected sizes to the new color
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
  toggleSize(size: string) {
    if (this.selectedSizes.has(size)) {
      this.selectedSizes.delete(size);
      // Remove size from all colors
      this.colorSizeDetails.forEach((sizeMap) => {
        sizeMap.delete(size);
      });
    } else {
      this.selectedSizes.add(size);
      // Add size to all colors
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
      this.availableSizes.push(size);
      this.toggleSize(size);
    }
  }

  getSelectedSizesArray(): string[] {
    return Array.from(this.selectedSizes);
  }

  getSizeDetailsForColor(colorIndex: number): SizeDetail[] {
    const sizeMap = this.colorSizeDetails.get(colorIndex);
    return sizeMap ? Array.from(sizeMap.values()) : [];
  }

  // Form Data Preparation
  private calculateTotalStock(): number {
    let total = 0;
    this.colorSizeDetails.forEach((sizeMap) => {
      sizeMap.forEach((detail) => {
        total += detail.quantity;
      });
    });
    return total;
  }

  // Sửa lại hàm updateColorSizeDetail để tự động cập nhật stock
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

        // Tự động cập nhật stock sau khi quantity thay đổi
        if ('quantity' in detail) {
          const oldStock = this.productForm.get('stock')?.value || 0;
          const newStock = this.calculateTotalStock();
          this.productForm.patchValue(
            { stock: newStock },
            { emitEvent: false }
          );

          // Thông báo thay đổi
          console.log(`Stock updated: ${oldStock} → ${newStock}`);
        }
      }
    }
  }
  // Form Data Preparation
  private prepareFormData(): FormData {
    const formData = new FormData();
    const productData: Partial<Product> = {
      ...this.productForm.value,
      productColors: undefined,
    };

    // Append basic product data
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    if (this.thumbnailFile) {
      formData.append('thumbnail', this.thumbnailFile);
    }

    // Prepare product colors and their sizes
    const productColors: any[] = [];
    const productDetails: any[] = [];

    this.colorSizeDetails.forEach((sizeMap, colorIndex) => {
      const colorControl = this.productColors.at(colorIndex);
      const colorId = colorControl.get('colorId')?.value;

      const colorData = {
        colorId,
        img: this.colorImages[colorIndex]
          ? this.colorImages[colorIndex].name
          : '',
        sizes: Array.from(sizeMap.values()).map((detail) => ({
          size: detail.size,
          quantity: detail.quantity,
          price: detail.price,
          isActive: detail.isActive,
        })),
      };

      productColors.push(colorData);
    });

    formData.append('productColors', JSON.stringify(productColors));

    // Append color images
    Object.entries(this.colorImages).forEach(([index, file]) => {
      formData.append(`colorImages`, file);
    });

    return formData;
  }

  // Event Handlers
  onThumbnailSelected(file: File) {
    this.thumbnailFile = file;
  }

  onThumbnailRemoved() {
    this.thumbnailFile = undefined;
  }

  getColorLabel(colorForm: AbstractControl): string {
    const colorId = colorForm.get('colorId')?.value;
    const colorName = this.colors.find((c) => c.id === colorId)?.name;
    return `Image for ${colorName || 'color'}`;
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
    // Ensure value is not negative
    value = Math.max(0, value);
    this.editingQuantity[`${colorIndex}-${size}`] = value;
  }

  onQuantityBlur(colorIndex: number, size: string) {
    const key = `${colorIndex}-${size}`;
    if (key in this.editingQuantity) {
      let value = this.editingQuantity[key];
      // Ensure value is not negative before updating
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

  onSubmit() {
    if (
      this.productForm.valid &&
      this.selectedSizes.size > 0 &&
      this.productColors.length > 0
    ) {
      const formData = this.prepareFormData();
      this.productService.createProduct(formData).subscribe({
        next: (response) => {
          console.log('Product created successfully', response);
          this.resetForm();
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
    this.createForm();
    this.thumbnailFile = undefined;
    this.colorImages = {};
    this.selectedSizes.clear();
    this.colorSizeDetails.clear();
    this.editingColorIndex = null;
    this.productForm.patchValue({ stock: 0 });
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

  private loadInitialData() {
    this.loadColors();
    this.loadDiscounts();
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