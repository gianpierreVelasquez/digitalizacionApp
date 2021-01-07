import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UiModalService } from 'src/app/shared/components/modal/ui-modal/ui-modal.service';
import { Desgravamen } from 'src/app/shared/models/Desgravamen';

import Swal from 'sweetalert2';

export enum SPINNER_TEXT {
  DEFAULT = 'Cargando información...',
  FILTER_DEFAULT = 'Buscando información con los parametros solicitados...'
}

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public spinnerTextValue = new BehaviorSubject<string>(SPINNER_TEXT.DEFAULT);

  desgravamenData = new BehaviorSubject<any>(null);

  entidadFormObserver = new BehaviorSubject<boolean>(false);
  entidadFormChecker = new BehaviorSubject<boolean>(false);

  //Operadores Solicitud
  conformacionData = new BehaviorSubject<any>('');
  monedaData = new BehaviorSubject<any>('');
  solicitudData = new BehaviorSubject<any>('');
  prestamoData = new BehaviorSubject<any>('');
  polizaGrupoData = new BehaviorSubject<any>('');

  planSeguroData = new BehaviorSubject<any>('');
  // Identifier to verify if there's a current plan
  isPlanActivated = new BehaviorSubject<any>(false);

  //Operadores Asegurado
  parentescoData = new BehaviorSubject<any>('');
  tipoDocData = new BehaviorSubject<any>('');
  tipoEstCiv = new BehaviorSubject<any>('');
  generoData = new BehaviorSubject<any>('');
  estCivilData = new BehaviorSubject<any>('');
  departamentoData = new BehaviorSubject<any>('');
  profesionesData = new BehaviorSubject<any>('');

  //Variables
  conformacionVar = new BehaviorSubject<any>('');
  monedaChecker = new BehaviorSubject<number>(0);
  dpsChecker = new BehaviorSubject<boolean>(false);

  constructor(private spinner: NgxSpinnerService, private modal: UiModalService) { }

  //Utility
  public dpsOnChange(): Observable<boolean> {
    return this.dpsChecker.asObservable();
  }

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

  // Alert 
  correctAlert(title?: string, text?: string) {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text
    })
  }

  warningAlert(title?: string, text?: string) {
    Swal.fire({
      icon: 'warning',
      title: title,
      text: text
    })
  }

  errorAlert(title?: string, text?: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text
    })
  }

  // Modal
  agregarComp(modal: any) {
    this.modal.add(modal);
  }

  quitarComp(id: string) {
    this.modal.remove(id);
  }

  showModal(id: string) {
    this.modal.open(id);
  }

  hideModal(id: string) {
    this.modal.close(id);
  }
}
