import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { BrandAllData, BrandService } from '../common/service/brand.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class FooterComponent {
  constructor(private brandService: BrandService) {}
  get partners() {
    return this.brandService.getBrands();
  }
}
