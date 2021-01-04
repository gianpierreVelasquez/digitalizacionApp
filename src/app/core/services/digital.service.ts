import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ROOT_DIGITAL } from '../enum/digital.enum';
import { Response } from '../../shared/models/Response';

const URI = environment.BASE_API_URL_DIGITAL;

@Injectable({
  providedIn: 'root'
})
export class DigitalService {

  private rootEntity = ROOT_DIGITAL;

  constructor(private http: HttpClient) { }

  async recuperarCuestionario(codCanal: number){
    return this.http.get<Response>(`${URI + this.rootEntity.RECUPERAR_CUESTIONARIO}/${codCanal}`).toPromise();;
  }

  requiereDps(poliza: any, data: any){
    return this.http.get<Response>(`${URI + this.rootEntity.REQUIERE_DPS}/${poliza}`, data);
  }

  obtenerTipoSolicitud() {
    return this.http.get<Response>(`${URI + this.rootEntity.TIPO_SOLICITUD}`);
  }

  obtenerTipoPoliza() {
    return this.http.get<Response>(`${URI + this.rootEntity.TIPO_GRUPO_POLIZA}`);
  }

  obtenerPlanSeguroVida() {
    var data = {
      cod_cia: 0,
      cod_ramo: 0,
      cod_tabla: 0
    }
    return this.http.post<Response>(`${URI + this.rootEntity.PLAN_SEGURO_VIDA}`, data);
  }

}
