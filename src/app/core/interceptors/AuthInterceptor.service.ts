import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SessionService } from '../services/session.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor {

  constructor(private session: SessionService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let request = req;
    request = req.clone({
      headers: req.headers
      .set('Content-Type', 'application/json')
      .set('Accept', '*/*')
    });
    return next.handle(request);
  }
}
