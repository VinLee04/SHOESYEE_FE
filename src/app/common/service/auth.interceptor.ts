import { isPlatformBrowser } from "@angular/common";
import { HttpInterceptorFn } from "@angular/common/http";
import { inject, PLATFORM_ID } from "@angular/core";


export const authInterceptor: HttpInterceptorFn = (request, next) => {
     const platformId = inject(PLATFORM_ID);
     let token = '';

      if (!request.url.includes('ghn.vn')) {
        if (isPlatformBrowser(platformId)) {
          token = localStorage.getItem('token') ?? '';
          console.log('Token retrieved from localStorage:', token);

          request = request.clone({
            setHeaders: {
              Authorization: token ? `Bearer ${token}` : '',
            },
          });
        }
      }

     console.log('Request headers:', request.headers);
     return next(request);
    }