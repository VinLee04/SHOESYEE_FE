import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class GhnService {
  private readonly API_URL = `${environment.ghnApiUrl}`;
  private readonly API_URL_ADDRESS = `${environment.ghnApiUrl}/master-data`;
  private readonly API_URL_SHIPPING = `${environment.ghnApiUrl}/v2/shipping-order`;
  private readonly TOKEN = `${environment.ghnToken}`;
  private readonly SHOP_ID = `${environment.ghnShopId}`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      token: this.TOKEN,
    });
  }

  getProvinces(): Observable<any> {
    return this.http.get(`${this.API_URL_ADDRESS}/province`, {
      headers: this.getHeaders(),
    });
  }

  getDistricts(provinceId: number): Observable<any> {
    return this.http.post(
      `${this.API_URL_ADDRESS}/district`,
      { province_id: Number(provinceId) },
      { headers: this.getHeaders() }
    );
  }

  getWards(districtId: number): Observable<any> {
    return this.http.post(
      `${this.API_URL_ADDRESS}/ward`,
      { district_id: Number(districtId) },
      { headers: this.getHeaders() }
    );
  }

  getAvailableServices(districtId: number): Observable<any> {
    return this.http.post(
      `${this.API_URL_SHIPPING}/available-services`,
      {
        shop_id: Number(this.SHOP_ID),
        from_district: 1442,
        to_district: Number(districtId),
      },
      { headers: this.getHeaders() }
    );
  }

  getFee(data:any): Observable<any> {
    return this.http.post(
      `${this.API_URL_SHIPPING}/fee`,
      {
        shop_id: Number(this.SHOP_ID),
        from_district: 1442,
        to_district: Number(data),
      },
      { headers: this.getHeaders() }
    );
  }
}