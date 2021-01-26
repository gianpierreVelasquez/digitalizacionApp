import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ROOT_DIGITAL } from '../enum/digital.enum';
import { Response } from '../../shared/models/Response';
import { ROOT_BASES } from '../enum/bases.enum';

const URI = environment.BASE_API_URL;

@Injectable({
  providedIn: 'root'
})
export class DigitalService {

  private baseEntity = ROOT_BASES;
  private rootEntity = ROOT_DIGITAL;

  constructor(private http: HttpClient) { }

  async recuperarCuestionario(codCanal: number){
    return this.http.get<Response>(`${URI + this.baseEntity.DESGRAVAMEN + this.rootEntity.RECUPERAR_CUESTIONARIO}/${codCanal}`).toPromise();
  }

  async requiereDPS(poliza: any, data: any){
    return this.http.post<any>(`${URI + this.baseEntity.DESGRAVAMEN + this.rootEntity.REQUIERE_DPS}/${poliza}`, JSON.stringify(data)).toPromise();
  }

  async obtenerTipoSolicitud() {
    return this.http.get<Response>(`${URI + this.baseEntity.DESGRAVAMEN + this.rootEntity.TIPO_SOLICITUD}`).toPromise();
  }

  async obtenerTipoPoliza() {
    return this.http.get<Response>(`${URI + this.baseEntity.DESGRAVAMEN + this.rootEntity.TIPO_GRUPO_POLIZA}`).toPromise();
  }

  async obtenerPlanSeguroVida() {
    var data = {
      cod_cia: 2,
      cod_ramo: 616,
      cod_tabla: 67
    }
    return this.http.post<Response>(`${URI + this.baseEntity.DESGRAVAMEN + this.rootEntity.PLAN_SEGURO_VIDA}`, data).toPromise();
  }

  async obtenerParametros(id) {
    return this.http.get<Response>(`${URI + this.baseEntity.DESGRAVAMEN + this.rootEntity.OBTENER_PARAMETROS}/${id}`).toPromise();
  }

}
