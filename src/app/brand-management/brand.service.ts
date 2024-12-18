// brand.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { API_URL_BRANDS, API_URL_UPLOADS } from '../../environment';

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
  constructor(private http: HttpClient) {}

  getBrands(): Observable<BrandAllData[]> {
    return this.http.get<BrandAllData[]>(`${API_URL_BRANDS}`).pipe(
      map((brands) =>
        brands.map((brand) => ({
          ...brand,
          logo: `${API_URL_UPLOADS}/${brand.logo}`,
        }))
      ),
      tap((brand) => console.log('brand: ', brand))
    );
  }

  getBrandManagement(): Observable<BrandAllData[]> {
    return this.http.get<BrandAllData[]>(`${API_URL_BRANDS}`).pipe(
      tap((brand) => console.log('brand: ', brand))
    );
  }

  createBrand(brand: BrandAllData): Observable<BrandAllData> {
    return this.http.post<BrandAllData>(`${API_URL_BRANDS}`, brand);
  }

  updateBrand(id: number, brand: BrandAllData): Observable<BrandAllData> {
    return this.http.put<BrandAllData>(`${API_URL_BRANDS}/${id}`, brand);
  }

  deleteBrand(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL_BRANDS}/${id}`);
  }

  restoreBrand(id: number): Observable<void> {
    return this.http.put<void>(`${API_URL_BRANDS}/restore/${id}`, {});
  }
}
