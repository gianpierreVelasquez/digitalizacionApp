import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { UtilService } from 'src/app/core/services/util.service';
import { ValidatorsService } from 'src/app/core/services/validators.service';

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
      { type: 'whitespace', message: 'Este campo no puede recibir caracteres vacíos.' }
    ],
    'fecha': [
      { type: 'required', message: 'Este campo es requerido.' },
      { type: 'whitespace', message: 'Este campo no puede recibir caracteres vacíos.' }
    ],
    'duracion': [
      { type: 'required', message: 'Este campo es requerido.' },
      { type: 'whitespace', message: 'Este campo no puede recibir caracteres vacíos.' }
    ],
    'clinica': [
      { type: 'required', message: 'Este campo es requerido.' },
      { type: 'whitespace', message: 'Este campo no puede recibir caracteres vacíos.' }
    ],
    'estado_actual': [
      { type: 'required', message: 'Este campo es requerido.' },
      { type: 'whitespace', message: 'Este campo no puede recibir caracteres vacíos.' }
    ]
  };

  constructor(private formBuilder: FormBuilder, private util: UtilService, private validator: ValidatorsService) {
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
        this.util.observacionFormObserver.next(true);
        this.t.clear();
      }
    });

    this.util.observacionFormChecker.subscribe(resp => {
      this.observacionForm.statusChanges.subscribe(resp => {
        if(resp === 'VALID'){
          this.setObservacion(this.observacionForm.controls.observacion.value)
        } else {
          this.observacionForm.markAllAsTouched();
        }
      })
    })
  }

  get f() { return this.observacionForm.controls; }
  get t() { return this.f.observacion as FormArray; }

  addObservation() {
    this.util.observacionFormObserver.next(false);
    if (this.t.length < this.maxObservations) {
      this.t.push(this.formBuilder.group({
        enfermedad: ['', [Validators.required, this.validator.noWhitespaceValidatorForString]],
        fecha: ['', [Validators.required]],
        duracion: ['', [Validators.required, this.validator.noWhitespaceValidatorForNumber]],
        clinica: ['', [Validators.required, this.validator.noWhitespaceValidatorForString]],
        estado_actual: ['', [Validators.required, this.validator.noWhitespaceValidatorForString]]
      }));
    }
  }

  setObservacion(values) {
    if (this.observacionForm.invalid) {
      this.util.observacionFormObserver.next(false);
      this.observacionForm.markAllAsTouched();
    } else {
      // this.util.correctAlert('Correcto', 'Se adjuntaron las observaciones correctamente.');
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
