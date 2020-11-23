import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ROOT_COMBOS } from '../enum/combos.enum';
import { Response } from '../../shared/models/Response';

const URI = environment.BASE_API_URL_COMBOS;

@Injectable({
  providedIn: 'root'
})
export class CombosService {

  private rootEntity = ROOT_COMBOS;

  constructor(private http: HttpClient) { }

  obtenerTipoConformación() {
    return this.http.get<Response>(`${URI + this.rootEntity.TIPO_CONFORMACION}`);
  }

  obtenerTipoMoneda() {
    return this.http.get<Response>(`${URI + this.rootEntity.TIPO_MONEDA}`);
  }

  obtenerTipoSolicitud() {
    return this.http.get<Response>(`${URI + this.rootEntity.TIPO_SOLICITUD}`);
  }

  obtenerTipoPrestamo() {
    return this.http.get<Response>(`${URI + this.rootEntity.TIPO_PRESTAMO}`);
  }

  obtenerTipoPoliza() {
    return this.http.get<Response>(`${URI + this.rootEntity.TIPO_GRUPO_POLIZA}`);
  }

  obtenerTipoDocumento() {
    return this.http.get<Response>(`${URI + this.rootEntity.TIPO_DOCUMENTO}`);
  }

  obtenerTipoParentesco() {
    return this.http.get<Response>(`${URI + this.rootEntity.TIPO_PARENTESCO}`);
  }

  obtenerPlanSeguroVida() {
    return this.http.get<Response>(`${URI + this.rootEntity.TIPO_PLAN_SEGURO_VIDA}`);
  }
}
