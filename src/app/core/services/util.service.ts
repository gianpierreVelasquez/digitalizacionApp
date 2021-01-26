import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
import { UiModalService } from 'src/app/shared/components/modal/ui-modal/ui-modal.service';

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

  callServices = new BehaviorSubject<boolean>(false);

  entidadFormObserver = new BehaviorSubject<boolean>(false);
  entidadFormChecker = new BehaviorSubject<boolean>(false);

  isPlanActivated = new BehaviorSubject<any>(false);

  direccionFormObserver = new BehaviorSubject<boolean>(false);
  direccionFormChecker = new BehaviorSubject<boolean>(false);

  observacionFormObserver = new BehaviorSubject<boolean>(false);
  observacionFormChecker = new BehaviorSubject<boolean>(false);
  validateObservacionFormObserver = new BehaviorSubject<boolean>(false);

  respuestaFormObserver = new BehaviorSubject<boolean>(false);
  respuestaFormChecker = new BehaviorSubject<boolean>(false);

  //Variables
  conformacionVar = new BehaviorSubject<any>('');
  monedaChecker = new BehaviorSubject<number>(0);
  dpsChecker = new BehaviorSubject<boolean>(false);
  dpsObserver = new BehaviorSubject<boolean>(false);
  cuestionarioIsSubmitted = new BehaviorSubject<boolean>(false);

  constructor(private spinner: NgxSpinnerService, private uimodalServ: UiModalService, private router: Router, private formBuilder: FormBuilder) { }

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

  notAllowAlert(title?: string, text?: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      showCancelButton: false,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Cerrar',
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        this.router.navigate(['/mantenimiento/error']);
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

      if (parseInt(date[1]) < 10) {
        m = '0' + parseInt(date[1])
      } else {
        m = date[1]
      }

      if (parseInt(date[0]) < 10) {
        d = '0' + parseInt(date[0])
      } else {
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

      if (parseInt(date[1]) < 10) {
        m = '0' + parseInt(date[1])
      } else {
        m = date[1]
      }

      if (parseInt(date[2]) < 10) {
        d = '0' + parseInt(date[2])
      } else {
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
    this.uimodalServ.add(modal);
  }

  quitarComp(id: string) {
    this.uimodalServ.remove(id);
  }

  showModal(id: string) {
    this.uimodalServ.open(id);
  }

  hideModal(id: string) {
    this.uimodalServ.close(id);
  }

  //Verifier
  propChecker(value: any, arr: any[]) {
    var obj = arr.find(x => x.codigo == value)
    if (obj != undefined) {
      return value
    }
    else {
      return null
    }
  }

  //FormChecker
  disabledFields(group: FormGroup) {
    Object.keys(group.controls).forEach(key => {
      if (group.controls[key].value != undefined && group.controls[key].value != "") {
        group.controls[key].disable();
      }
    });
  }

  convertToFormGroup(object) {
    const newObj = {};
    Object.keys(object).map(key => {
      if (Array.isArray(object[key])) {
        newObj[key] = this.formBuilder.array([]);
        for(const value of object[key]) {
          newObj[key].push(this.formBuilder.group(value));
        }
      } else {
        newObj[key] = object[key];
      }
    });
    return this.formBuilder.group(newObj);
  }

}
