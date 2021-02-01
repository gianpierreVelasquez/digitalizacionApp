import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ROOT_BASES } from '../enum/bases.enum';
import { SessionService } from './session.service';
import Swal from 'sweetalert2';
import * as Djson from '../../../assets/digitalizacionAppConfig.json';
import { ERROR_MESSAGES } from '../enum/errors.enum';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilService } from './util.service';

const URI = "https://api.pre.mapfre.com.pe/app/api/core/v1.0";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private configVar: any = (Djson as any).default;
  private baseEntity = ROOT_BASES;

  constructor(private http: HttpClient, private session: SessionService, private router: Router, private spinner: NgxSpinnerService, private util: UtilService) { }

  getCredencials() {
    let headers = new HttpHeaders();
    var appsJson: any[] = this.configVar;
    var configVars: any[] = this.configVar[0];
    var data; var codApp;

    codApp = this.session.getSession(environment.KEYS.CODE_APP);

    if(codApp != null){
      data = appsJson.find(x => x.id == codApp);

      if(data){
        data.authdata = window.btoa(data.username + ':' + data.password);

        headers = headers.append('Authorization', `Basic ${data.authdata}`);
        headers = headers.append('usua_integracion', `${configVars['usua_integracion']}`);
        headers = headers.append('usua_id', `${configVars['usua_id']}`);
        headers = headers.append('aplic_id', `${configVars['aplic_id']}`);

        this.util.tokenNeedsUpdate.next(false);
        return this.http.post<any>(`${URI + this.baseEntity.LOGIN}`, {}, { headers: headers }).toPromise();
      } else {
        this.notAllowAlert('Advertencia', ERROR_MESSAGES.BOTH_CODES);
        this.hideSpinner();
      }

    } else {
        this.notAllowAlert('Advertencia', ERROR_MESSAGES.MISS_COD_APP);
        this.hideSpinner();
    }
  }
  

  hideSpinner() {
    this.spinner.hide();
  }

  notAllowAlert(title?: string, text?: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      showCancelButton: false,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Cerrar',
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        this.router.navigate(['/mantenimiento/error']);
      }
    })
  }
}
