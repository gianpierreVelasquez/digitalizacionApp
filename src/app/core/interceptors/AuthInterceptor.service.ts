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
    const token: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkucHJlLm1hcGZyZS5jb20ucGUiLCJpYXQiOjE2MDkyODE3MTMsImV4cCI6MTY0MDgxNzcxMywiYXVkIjoiTG9naW4iLCJzdWIiOiJhcGljanBpdXJhcHJlIiwidG9rZW5fc2VnIjoiODE0MDE3ZmZjNGNmZmE0OTNiNzNhMGE5MDQwMDQ1Yjk4MjhmMmM1NzNmM2UxNjE2YjkyNDhmZDJkZmRhNmQ4YWEzNGNhZjc1NjA5NmFjZjE5MTJjY2U0NjI3YmFiNjBiNDNjMWQ1YTJmNDQzYzdkOTdiN2VjZjkzNmI1Y2RjN2QwMWJmN2QwMGYxYTQ0ODVjZmM0YjgyMmQwNTc2NTNhNTNhZmM0NWI0YjZkZDViZDc5ODE2ZWNlOGUwNTcxYWQ1MWI0YThjYTBlMTM3NGU5ZWNlNTdkYWQ2YWQ2ZmE4YjhhMGQ4YjBhN2Y3ZTU3ZTNmYTY5YTkzNjJhYTAwMzZlMWVkZGM1ZTA0ZTI2MTk1OTRjYThmMTRkYjNlNzk2ZmQ0NjA4YTU4M2IxNTQ0MDAwNzc0YmYzYzczZTliZjRkODY1N2Y3NmIxMDk0NGUyMWEzY2MwMTk0YTQ1ZjkzZDEzOWY5NDMzZjFiM2YyZTViNmVmNWQ4ODU4OThlMjk0ZDViMTMwYWQwYzA2ZmU1YTE2Y2Y2MTVjODg1OWM5NjM5YmRjOGU1OWUxNDhlMDE3ZTJhMjUzYmVjNzc1ZTFhYWE0OWM0YjE1NzM2ZDBiMDQ1NjYwYzBjZDU5OTZiNWVlMDVhMDU3ZjQyMTYxZDM4NGNlMTVlZDFlOGVmMzJlZjhiYjJhZmY4YjhkNTRjYzJlN2I4NzI5NDhjNTk4MTlmZGY0YzcyOTA3N2Q3ZjYwZTM0YmVkMDY1MmJjNzdmYjgzMGIwYzA3NTkxYTBjMzE1NTNkNTViYWU3ODMwMTkxZGYzYTgwZDVkZmQ2ZTJhMTAzNWZhZjM3YjFlNjIyZWY5YjhkNTg5NDVkYmRjMWYyMWQ4OTgyMzllNWJkOTQwMDk5ODM0ZDI4MTNmNzkyZTY5In0.zK0Etug3e1VDu2eKpvtFeY9zIa5Y6it1xV2FzcOyt3Q'
    let request = req;
    if (token) {
      request = req.clone({
        headers: req.headers
          .set('Content-Type', 'application/json')
          // .set('Authorization', `Bearer ${token}`)
          // .set('token_seg', `${token}`)
          .set('aplic_id', `78`)
          .set('usua_id', `apicjpiurapre`)
      });
    }

    return next.handle(request);

    // return next.handle(request).pipe(tap(() => {},
    //   (err: any) => {
    //     if (err instanceof HttpErrorResponse) {
    //       if (err.status == 401) {
    //         return;
    //       }
    //       this.util.showError('Sesión Expirada', 'Su sesión acaba de expirar, vuelva a iniciar sesión porfavor.')
    //       this.router.navigate(['/']);
    //     }
    //   }));
  }
}
