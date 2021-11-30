import { Injectable, Injector } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private injector: Injector) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokenizedReq = req.clone({
      setHeaders: {
        token: 'Bearer ' + localStorage.getItem("token")
      }
    });

    return next.handle(tokenizedReq);
  }
}
