import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { API_URL_BRANDS, API_URL_UPLOADS } from '../../../environment';

export interface BrandAllData {
  id: number;
  name: string;
  description: string;
  logo: string;
  url: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private brandsSignal = signal<BrandAllData[]>([]);

  constructor(private http: HttpClient) {
    this.loadBrands();
  }

  private loadBrands() {
    this.http
      .get<BrandAllData[]>(API_URL_BRANDS)
      .pipe(
        map((brands) =>
          brands.map((brand) => ({
            ...brand,
            logo: `${API_URL_UPLOADS}/${brand.logo}`,
          }))
        )
      )
      .subscribe((transformedBrands) => {
        this.brandsSignal.set(transformedBrands);
      });
  }

  getBrands() {
    return this.brandsSignal;
  }

  getBrandNames(): string[] {
    return this.brandsSignal().map(brand => brand.name);
  }

  // constructor(private http: HttpClient) {}

  // fetchAllBranch(): Observable<BrandAllData[]> {
  //   return this.http.get<BrandAllData[]>(`${this.apiUrl}`).pipe(
  //     map((brands) =>
  //       brands.map((brand) => ({
  //         ...brand,
  //         logo: `${API_URL_UPLOADS}/${brand.logo}`,
  //       }))
  //     ),
  //     tap((transformedBrands) => {
  //       console.log('Transformed brands:', transformedBrands);
  //     })
  //   );
  // }
}
