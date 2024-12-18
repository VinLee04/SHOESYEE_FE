import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { API_URL_BRANDS, API_URL_CATEGORIES, API_URL_UPLOADS } from '../../environment';

export interface CategoryAllData {
  id: number | null | undefined;
  name: string;
  parentId?: number;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  constructor(private http: HttpClient) {
  }

  getCategories(): Observable<CategoryAllData[]> {
    return this.http.get<CategoryAllData[]>(`${API_URL_CATEGORIES}`);
  }

  createOrUpdateCategory(
    category: CategoryAllData
  ): Observable<CategoryAllData> {
    if (category.id) {
      return this.updateCategory(category);
    } else {
      return this.createCategory(category);
    }
  }

  createCategory(category: CategoryAllData): Observable<CategoryAllData> {
    return this.http.post<CategoryAllData>(`${API_URL_CATEGORIES}`, category);
  }

  updateCategory(category: CategoryAllData): Observable<CategoryAllData> {
    return this.http.put<CategoryAllData>(`${API_URL_CATEGORIES}/${category.id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL_CATEGORIES}/${id}`);
  }

  restoreCategory(id: number): Observable<void> {
    return this.http.put<void>(`${API_URL_CATEGORIES}/restore/${id}`, {});
  }
}
