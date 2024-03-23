import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticateService } from '../auth/authenticate.service';
import { UtilsService } from '../shared/utility';
import { Router } from '@angular/router';
import { ToastMessageService } from '../shared/toast-message.service';

@Injectable()
export class authInterceptor implements HttpInterceptor {
token: any;
  constructor(
    private authenticateService: AuthenticateService,
    private util: UtilsService,
    private router: Router,
    private toastService: ToastMessageService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authenticateService.token.subscribe((tokenData) => {
      // console.log(tokenData)
      if (tokenData) {
        this.token = tokenData;
      } else {
        const tokenDataId = this.util.getItemToLocalStorage('authToken');
        if (tokenDataId) {
          this.token = tokenDataId;
        }
      }
    });

    request = this.addTokenToRequest(request, this.token);
    next.handle(request);

  return next.handle(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 440) {
        // Handle 401 Unauthorized response here
        this.util.removeItemToLocalStorage('authToken');
        this.authenticateService.token.next(null);
        this.authenticateService.isAuthenticate.next(false);
        this.toastService.showErrorToast('Your session has expired. Please log in again.');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 500);
        // this.authenticateService.isAuthInvalid.next(true);
      }
      return throwError(error);
    })
  );
}
private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      authorization: `Bearer ${token}`
    }
  });
  }

  // private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   return this.authService.refreshToken().pipe(
  //     switchMap((newToken) => {
  //       // If refresh is successful, retry the original request with the new token
  //       request = this.addTokenToRequest(request, newToken);
  //       return next.handle(request);
  //     }),
  //     catchError((refreshError) => {
  //       // Handle refresh error or logout the user
  //       this.authService.logout();
  //       return throwError(refreshError);
  //     })
  //   );
  // }

}
