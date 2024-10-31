import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { NotificationService } from '../../notification/notification.service';
import { environment } from '../../../environment';
import { ApiResponse, DataResponse } from '../../interface/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  protected readonly SUCCESS_CODE = environment.successCode;


  constructor(protected notificationService: NotificationService) {}

  protected handleResponse<T>(response: ApiResponse): DataResponse<T> {
    const success = response.code === this.SUCCESS_CODE;
    if (success) {
      console.log(response.code, response.message);
      if (response.message === '' || response.message === undefined) {
        this.notificationService.show(
          `Successful!`,
          'success',
        );
      } else {
        this.notificationService.show(
          `${response.message}`,
          'success',
        );
      }
    } else {
      console.log('Error: ' + response.code + ' ' + response.message);
      this.notificationService.show(
        `${response.message}`,
        'error',
      );
    }
    return { success, result: response.result as T }; // Trả về DataResponse
  }

  protected handleError = (error: any) => {
    const errorMessage = error.message || 'An unexpected error occurred';
    this.notificationService.show(errorMessage, 'error');
    return throwError(() => error);
  };

  protected checkResponse(response: ApiResponse): boolean {
    if (response.code === this.SUCCESS_CODE) {
      this.notificationService.show('Operation successful!', 'success');
      return true;
    } else {
      this.notificationService.show(
        response.message || 'An error occurred',
        'error',
        response.code
      );
      return false;
    }
  }
}