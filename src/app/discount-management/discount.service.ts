// discount.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { API_URL_DISCOUNTS} from '../../environment';

export interface DiscountAllData {
  id: number | null;
  percent: number;
  startDay: number;
  endDay: number;
  comment: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  constructor(private http: HttpClient) {}

  getDiscounts(): Observable<DiscountAllData[]> {
    return this.http.get<DiscountAllData[]>(`${API_URL_DISCOUNTS}`).pipe(
      map((discounts) =>
        discounts.map((discount) => ({
          ...discount,
          startDay: discount.startDay * 1000,
          endDay: discount.endDay * 1000,
        }))
      ),
      tap((discount) => console.log('discount: ', discount))
    );
  }

  private convertToISOString(date: number): string {
    return new Date(date).toISOString();
  }

  private convertToTimestamp(date: number | string): number {
    return Math.floor(new Date(date).getTime() / 1000);
  }

  createDiscount(discount: DiscountAllData): Observable<DiscountAllData> {
    const formattedDiscount = {
      ...discount,
      startDay: this.convertToTimestamp(discount.startDay),
      endDay: this.convertToTimestamp(discount.endDay),
    };

    return this.http
      .post<DiscountAllData>(`${API_URL_DISCOUNTS}/create`, formattedDiscount)
      .pipe(
        map((response) => ({
          ...response,
          startDay: response.startDay * 1000,
          endDay: response.endDay * 1000,
        }))
      );
  }

  updateDiscount(
    id: number,
    discount: DiscountAllData
  ): Observable<DiscountAllData> {
    const formattedDiscount = {
      ...discount,
      startDay: this.convertToTimestamp(discount.startDay),
      endDay: this.convertToTimestamp(discount.endDay),
    };

    return this.http
      .put<DiscountAllData>(`${API_URL_DISCOUNTS}/${id}`, formattedDiscount)
      .pipe(
        map((response) => ({
          ...response,
          startDay: response.startDay * 1000,
          endDay: response.endDay * 1000,
        }))
      );
  }

  deleteDiscount(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL_DISCOUNTS}/${id}`);
  }

  restoreDiscount(id: number): Observable<void> {
    return this.http.put<void>(`${API_URL_DISCOUNTS}/restore/${id}`, {});
  }

  getLsPercents(): Observable<number[]> {
    return this.http.get<number[]>(`${API_URL_DISCOUNTS}/active-percents`);
  }
}