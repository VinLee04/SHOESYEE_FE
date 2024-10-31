import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports:[CommonModule]
})
export class FooterComponent {
  partners = [
    { name: 'Brand A', logo: 'brand/adidas.png' },
    { name: 'Brand B', logo: 'brand/converse.png' },
    // { name: 'Brand C', logo: 'brand/jordan.png' },
    { name: 'Brand D', logo: 'brand/nike.png' },
    { name: 'Brand E', logo: 'brand/puma.png' },
  ];
}
