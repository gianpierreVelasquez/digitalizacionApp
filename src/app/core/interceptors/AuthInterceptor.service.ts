import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SessionService } from '../services/session.service';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UtilService } from '../services/util.service';

@Injectable({
  providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor {

  constructor(private session: SessionService, private util: UtilService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.session.getSession(environment.KEYS.TOKEN);
  
    let request = req;
    
    if (token != undefined && req.url != 'https://api.pre.mapfre.com.pe/app/api/core/v1.0/login' ) {
      request = req.clone({
        headers: req.headers
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token.token}`)
          .set('token_seg', `${token.token}`) 
      });
    }

    return next.handle(request).pipe(tap(() => { },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {

          if (err.status != 200) {
            if(err.error.context == 'Service: RecuperarParametros'){
              this.util.notAllowAlert('Advertencia', 'El idParam ingresado no es válido.');
            } else {
              this.util.notAllowAlert('Advertencia', err.error.message);
            }
          }
        }
      }));
  }
}
