import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { BrandAllData, BrandService } from '../brand-management/brand.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class FooterComponent implements OnInit{
  partners!:BrandAllData[];
  constructor(private brandService: BrandService) {}

  ngOnInit(): void {
      this.brandService.getBrands().subscribe((response:any) => this.partners=response);
  }
  
}
