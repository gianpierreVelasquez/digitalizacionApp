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

  async obtenerTipoConformación() {
    return await this.http.get<Response>(`${URI + this.rootEntity.TIPO_CONFORMACION}`).toPromise();
  }

  async obtenerTipoMoneda() {
    return await this.http.get<Response>(`${URI + this.rootEntity.TIPO_MONEDA}`).toPromise();
  }

  async obtenerTipoPrestamo() {
    return await this.http.get<Response>(`${URI + this.rootEntity.TIPO_PRESTAMO}`).toPromise();
  }

  async obtenerTipoDocumento() {
    return await this.http.get<Response>(`${URI + this.rootEntity.TIPO_DOCUMENTO}`).toPromise();
  }

  async obtenerTipoParentesco() {
    return await this.http.get<Response>(`${URI + this.rootEntity.TIPO_PARENTESCO}`).toPromise();
  }

  async obtenerEstadoCivil() {
    return await this.http.get<Response>(`${URI + this.rootEntity.TIPO_ESTADO_CIVIL}`).toPromise();
  }

  async obtenerGenero() {
    return await this.http.get<Response>(`${URI + this.rootEntity.TIPO_GENERO}`).toPromise();
  }

  async obtenerDepartamento() {
    return await this.http.get<Response>(`${URI + this.rootEntity.DEPARTAMENTO}`).toPromise();
  }

  async obtenerProvincia(codDepartamento:any) {
    return await this.http.get<Response>(`${URI + this.rootEntity.PROVINCIA}/${codDepartamento}`).toPromise();
  }

  async obtenerDistrito(codProvincia:any) {
    return await this.http.get<Response>(`${URI + this.rootEntity.DISTRITO}/${codProvincia}`).toPromise();
  }

  async obtenerProfesiones() {
    return await this.http.get<Response>(`${URI + this.rootEntity.TIPO_PROFESION}`).toPromise();
  }

}
