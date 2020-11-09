import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ROOT_COMBOS } from '../enum/combos.enum';

const URI = environment.BASE_API_URL_COMBOS;

@Injectable({
  providedIn: 'root'
})
export class CombosService {

  private rootEntity = ROOT_COMBOS;

  constructor(private http: HttpClient) { }

  obtenerTipoMoneda() {
    return this.http.get(`${URI + this.rootEntity.TIPO_MONEDA}`);
  }
}
