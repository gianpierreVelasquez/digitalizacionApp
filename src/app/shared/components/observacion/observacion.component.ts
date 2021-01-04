import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-dynamic-observacion',
  templateUrl: './observacion.component.html',
  styleUrls: ['./observacion.component.scss']
})
export class ObservacionComponent implements OnInit {

  observacionForm: FormGroup;
  submitted = false;
  formComplete = false;

  maxObservations = 3;

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
    this.addObservation();
  }

  get f() { return this.observacionForm.controls; }
  get t() { return this.f.observacion as FormArray; }

  addObservation() {
    if (this.t.length < this.maxObservations) {
        this.t.push(this.formBuilder.group({
          enfermedad: ['', Validators.required],
          fecha: ['', [Validators.required]],
          duracion: ['', [Validators.required]],
          clinica: ['', [Validators.required]],
          estado_actual: ['', [Validators.required]]
        }));
    }
  }

  setObservacion(values) {
    // stop here if form is invalid
    if (this.observacionForm.invalid) {
      this.observacionForm.markAllAsTouched();
    } else {
      this.submitted = true;
      this.formComplete = true;
      console.log(values);
    }
  }

  removeObservation(i) {
    this.submitted = false;
    this.formComplete = false;
    this.t.removeAt(i);
  }

  onReset() {
    // reset whole form back to initial state
    this.submitted = false;
    this.observacionForm.reset();
    this.t.clear();
  }

  onClear() {
    // clear errors and reset ticket fields
    this.submitted = false;
    this.t.reset();
  }

}
