import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ROOT_DIGITAL } from '../enum/digital.enum';

const URI = environment.BASE_API_URL_COMBOS;

@Injectable({
  providedIn: 'root'
})
export class DigitalService {

  private rootEntity = ROOT_DIGITAL;

  constructor(private http: HttpClient) { }

  recuperarCuestionario(){
    return this.http.get(`/wsRDesgravamen.svc/recuperar-cuestionario/21`);
  }

  requiereDps(){
    return this.http.get(`/wsRDesgravamen.svc/requiere-dps/01-01-1999/22/11`);
  }

}
