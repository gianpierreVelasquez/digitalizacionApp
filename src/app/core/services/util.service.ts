import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UiModalService } from 'src/app/shared/components/modal/ui-modal/ui-modal.service';
import { Desgravamen } from 'src/app/shared/models/Desgravamen';

import Swal from 'sweetalert2';

export enum SPINNER_TEXT {
  DEFAULT = 'Cargando información...',
  PARAMETERS = 'Obteniendo Parametros...',
  PLANS = 'Cargando planes disponibles...',
  QUIZ = 'Cargando preguntas...',
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

  direccionFormObserver = new BehaviorSubject<boolean>(false);
  direccionFormChecker = new BehaviorSubject<boolean>(false);

  observacionFormObserver = new BehaviorSubject<boolean>(false);
  observacionFormChecker = new BehaviorSubject<boolean>(false);

  //Variables
  conformacionVar = new BehaviorSubject<any>('');
  monedaChecker = new BehaviorSubject<number>(0);
  dpsChecker = new BehaviorSubject<boolean>(false);
  dpsObserver = new BehaviorSubject<boolean>(false);

  constructor(private spinner: NgxSpinnerService, private modal: UiModalService, private router: Router) { }

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

  notAllowAlert(title?: string, text?: string){
    Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      showCancelButton: false,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Cerrar'
    }).then((result) => {
      if (result.value) {
        this.router.navigate(['']);
      }
    })
  }

  //Date
  dateConverterToPlatform(value: any) {
    const DELIMITER = '/';
    if (value) {
      var a, m, d;
      var date = value.split(DELIMITER);

      a = date[2];

      if(parseInt(date[1]) < 10){
        m = '0'+parseInt(date[1])
      }else {
        m = date[1]
      }
     
      if(parseInt(date[0]) < 10){
        d = '0'+parseInt(date[0])
      }else {
        d = date[0]
      }

      var newDate = a + '-' + m + '-' + d;

      return newDate;
    } else {
      return '';
    }
  }

  dateConverterToServer(value: any) {
    const DELIMITER = '-';
    if (value) {
      var a, m, d;
      var date = value.split(DELIMITER);

      a = date[0];

      if(parseInt(date[1]) < 10){
        m = '0'+parseInt(date[1])
      }else {
        m = date[1]
      }
     
      if(parseInt(date[2]) < 10){
        d = '0'+parseInt(date[2])
      }else {
        d = date[2]
      }

      var newDate = d + '-' + m + '-' + a;

      return newDate;
    } else {
      return '';
    }
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

  //Verifier
  propChecker(value: any, arr: any[]){
    var obj = arr.find(x => x.codigo == value)
    if(obj != undefined) {
      return value
    }
    else {
      return null
    }
  }
}
