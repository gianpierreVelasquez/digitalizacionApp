import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Subject } from 'rxjs';
import { PlanData } from 'src/app/shared/models/Response';

export enum SPINNER_TEXT {
  DEFAULT = 'Cargando información...',
  FILTER_DEFAULT = 'Buscando información con los parametros solicitados...'
}

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public spinnerTextValue = new BehaviorSubject<string>(SPINNER_TEXT.DEFAULT);

  //Operadores
  conformacionData = new Subject();
  monedaData = new Subject();
  solicitudData = new Subject();
  prestamoData = new Subject();
  polizaGrupoData = new Subject();
  planSeguroData = new Subject();

  constructor(private spinner: NgxSpinnerService) { }

  // Spinner
  showSpinner() {
    this.spinner.show();
  }

  hideSpinner() {
    this.spinner.hide();
  }

  setSpinnerTextValue(text: string) {
    setTimeout(() => {
      this.spinnerTextValue.next(text);
    });
  }

}
