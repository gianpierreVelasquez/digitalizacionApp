import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-dynamic-observacion',
  templateUrl: './observacion.component.html',
  styleUrls: ['./observacion.component.scss']
})
export class ObservacionComponent implements OnInit {

  @Input() aseguradoIndex: number;

  private needObservationObserver = new BehaviorSubject<boolean>(false);

  @Input() 
  set needObservation(value) {
    // set the latest value for neddObservationObserver BehaviorSubject
    this.needObservationObserver.next(value);
  };

  get needObservation() {
    // get the latest value from neddObservationObserver BehaviorSubject
    return this.needObservationObserver.getValue();
  };

  @Output() dataGetter = new EventEmitter<any>();


  observacionForm: FormGroup;
  submitted = false;

  maxObservations = 3;

  validateObservacionFormObserverHelper: boolean = false;

  validations = {
    'enfermedad': [
      { type: 'required', message: 'Este campo es requerido.' },
    ],
    'fecha': [
      { type: 'required', message: 'Este campo es requerido.' },
    ],
    'duracion': [
      { type: 'required', message: 'Este campo es requerido.' },
    ],
    'clinica': [
      { type: 'required', message: 'Este campo es requerido.' },
    ],
    'estado_actual': [
      { type: 'required', message: 'Este campo es requerido.' },
    ]
  };

  constructor(private formBuilder: FormBuilder, private util: UtilService) {
    this.observacionForm = this.formBuilder.group({
      observacion: new FormArray([])
    });
  }

  ngOnInit() {
    this.needObservationObserver.subscribe(resp => {
      this.validateObservacionFormObserverHelper = resp;
      if (resp == true) {
        this.addObservation();
      } else {
        this.t.clear();
      }
    });

    this.util.observacionFormChecker.subscribe(resp => {
      this.setObservacion(this.observacionForm.value);
    })
  }

  get f() { return this.observacionForm.controls; }
  get t() { return this.f.observacion as FormArray; }

  addObservation() {
    this.util.observacionFormObserver.next(false);
    if (this.t.length < this.maxObservations) {
      this.t.push(this.formBuilder.group({
        enfermedad: ['', [Validators.required]],
        fecha: ['', [Validators.required]],
        duracion: ['', [Validators.required]],
        clinica: ['', [Validators.required]],
        estado_actual: ['', [Validators.required]]
      }));
    }
  }

  setObservacion(values) {
    if (this.observacionForm.invalid) {
      this.util.observacionFormObserver.next(false);
      this.observacionForm.markAllAsTouched();
    } else {
      this.submitted = true;
      this.util.observacionFormObserver.next(true);
      this.dataGetter.emit(values.observacion);
    }
  }

  removeObservation(i) {
    if (this.validateObservacionFormObserverHelper == true && this.t.length < 2) {
      this.util.warningAlert('Advertencia', 'Debes agregar almenos una observación.')
    } else {
      this.submitted = false;
      this.t.removeAt(i);
    }
  }

  onReset() {
    this.submitted = false;
    this.observacionForm.reset();
    this.t.clear();
  }

  onClear() {
    this.submitted = false;
    this.t.reset();
  }

}
