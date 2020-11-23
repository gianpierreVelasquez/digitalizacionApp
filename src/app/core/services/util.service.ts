import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UiModalService } from 'src/app/shared/components/modal/ui-modal/ui-modal.service';

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

  //Operadores
  conformacionData = new Subject();
  monedaData = new Subject();
  solicitudData = new Subject();
  prestamoData = new Subject();
  polizaGrupoData = new Subject();

  parentescoData = new Subject();
  tipoDocData = new Subject();
  generoData = new Subject();
  estCivilData = new Subject();

  planSeguroData = new Subject();


  //Variables
  conformacionVar = new Subject();
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
