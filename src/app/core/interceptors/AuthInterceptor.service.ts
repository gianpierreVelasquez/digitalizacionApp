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
    // const token = this.session.getSession(environment.KEYS.TOKEN).token;
    const token = 'eyJhbGciOiJIUzI1NiJ9.ew0KICAiaXNzIjogImFwaS5wcmUubWFwZnJlLmNvbS5wZSIsDQogICJpYXQiOiAxNjA1NzIyNzM5LA0KICAiZXhwIjogMTYwNTcyMjczOSwNCiAgImF1ZCI6ICJMb2dpbiIsDQogICJzdWIiOiAiYXBpY2pwaXVyYXByZSIsDQogICJqdGkiOiAiMDlmMGNjZjEtMWM4YS00YWVkLWJiMGYtNjg2ZTU4OTg1ZDlhIiwNCiAgInNjb3BlIjogIltHZXN0aW9uUG9saXphc19FeHRlcm5vIEdlc3Rpb25hclN1c2NyaXBjaW9uX0V4dGVybm8gR2VuZXJhckRvY3VtZW50b0V4dGVybmFsIENvbnN1bHRhRGF0b3NQZXJzb25hbGVzRXh0ZXJuYWwgQ29uc3VsdGFBdXRvc1BsYWNhRXh0ZXJuYWxdIiwNCiAgInRva2VuX3NlZyI6ICJleUpoYkdjaU9pSklVelV4TWlKOS5leUpxZEdraU9pSTFaR0l4TkRsbVppMDRaVGswTFRRMVl6VXRZVEV5TkMxbE1XUm1Oamd3WmpZeU9Ea2lMQ0p6ZFdJaU9pSmhjR2xqYW5CcGRYSmhjSEpsSWl3aWRYTjFZVjlwYm5SbFozSmhZMmx2YmlJNkltRndhV05xY0dsMWNtRndjbVVpTENKaGNHeHBZMTlwWkNJNk1Td2lhV0YwSWpveE5qRXhOamM0T1RZekxDSmxlSEFpT2pFMk1UUXpNRGczTVROOS42VUE0TkV3Q2hqb1ZNS2JBYk1HcWxOM000RjRTd2RlQUdrcnhaY1NKQ214ejB0R0Vtc0lybXhSQmxzdnlCX295VmlKWGVZeWkyRWwxb0Jqc3BTMzVpQSINCn0.kEni0tzrOteQLosxI_qIf8qyJoFSnAL5oGobNTyWANQ'
    let request = req;
    
    if (token && !req.headers.has('Authorization')) {
      request = req.clone({
        headers: req.headers
          .set('Content-Type', 'application/json')
          .set('token_seg', `${token}`)
      });
    }

    return next.handle(request).pipe(tap(() => { },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {

          if (err.status != 200) {
            this.util.notAllowAlert('Advertencia', err.error.message)
          }

        }
      }));
  }
}
