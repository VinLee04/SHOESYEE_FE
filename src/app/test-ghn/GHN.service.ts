// services/ghn.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class GHNService {
  private ghnToken = environment.connectCoreUri; // Add your GHN token in environment
  private ghnShopId = environment.connectCoreUri; // Add your GHN shop ID in environment
  private baseUrl =
    'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return new HttpHeaders({
      Token: this.ghnToken,
      ShopId: this.ghnShopId.toString(),
      'Content-Type': 'application/json',
    });
  }

  getProvinces(): Observable<any> {
    return this.http.get(`${this.baseUrl}/province`, {
      headers: this.getHeaders(),
    });
  }

  getDistricts(provinceId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/district`,
      { province_id: provinceId },
      { headers: this.getHeaders() }
    );
  }

  getWards(districtId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/ward`,
      { district_id: districtId },
      { headers: this.getHeaders() }
    );
  }

  getServices(districtId: number): Observable<any> {
    return this.http.post(
      'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services',
      {
        shop_id: this.ghnShopId,
        from_district: environment.connectCoreUri, // Your shop's district ID
        to_district: districtId,
      },
      { headers: this.getHeaders() }
    );
  }
}
