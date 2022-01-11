import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor{

  constructor(private auth: AuthService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    let token: string | null = this.auth.getToken();

    if(token != null) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token),
      });
      return next.handle(cloned).pipe(
        catchError((error : HttpErrorResponse) => {
          let errorMessage;
          switch (error.status) {
            case 401:
              this.auth.logout();
              errorMessage = 'Token has expired';
              break;
            case 400:
            case 404:
              this.router.navigateByUrl('/main');
              errorMessage = 'Resource not found';
              break;
            case 500:
              this.router.navigateByUrl('/main');
              errorMessage = 'Server-side error: ' + error.error.message;
              break;
            default:
              errorMessage = 'An error has ocurred';
          }
          return throwError(errorMessage);
        })
      );
    }

    return next.handle(req);
  }
}
