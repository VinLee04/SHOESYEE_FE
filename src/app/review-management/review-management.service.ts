import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL_REVIEWS } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewManagementService {
  private apiUrl = API_URL_REVIEWS; // Replace with actual backend URL

  constructor(private http: HttpClient) {}

  getAllReviews(page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get(`${this.apiUrl}`, { params });
  }

  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${reviewId}`);
  }
}
