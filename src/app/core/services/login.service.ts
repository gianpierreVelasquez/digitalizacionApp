import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ROOT_BASES } from '../enum/bases.enum';
import { SessionService } from './session.service';

import * as Djson from '../../../assets/digitalizacionAppConfig.json';

const URI = environment.BASE_API_URL;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apps: any = (Djson as any).default;
  private baseEntity = ROOT_BASES;

  constructor(private http: HttpClient, private session: SessionService) {}

  getCredencials(){
    let headers = new HttpHeaders();
    var appsJson:any[] = this.apps;
    var data;

    var codApp = this.session.getSession(environment.KEYS.CODE_APP);
    data = appsJson.find(x => x.id == codApp);
    data.authdata = window.btoa(data.username + ':' + data.password);

    headers = headers.append('Authorization', `Basic ${data.authdata}`);
    
    return this.http.post<any>(`${URI + this.baseEntity.LOGIN}`, {}, {headers: headers}).toPromise();

  }

}
