import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { UtilService } from 'src/app/core/services/util.service';
import { ValidatorsService } from 'src/app/core/services/validators.service';

@Component({
  selector: 'app-dynamic-respuesta',
  templateUrl: './respuesta.component.html',
  styleUrls: ['./respuesta.component.scss']
})
export class RespuestaComponent implements OnInit {

  @Output() dataGetter = new EventEmitter<any>();

  private needRespuestaObserver = new BehaviorSubject<string>('');

  @Input() 
  set needRespuesta(value) {
    // set the latest value for neddObservationObserver BehaviorSubject
    this.needRespuestaObserver.next(value);
  };

  get needRespuesta() {
    // get the latest value from neddObservationObserver BehaviorSubject
    return this.needRespuestaObserver.getValue();
  };

  respuestaForm: FormGroup;
  frecList = [
    {
      codigo: 'DIARIO',
      texto: 'Diario'
    },
    {
      codigo: 'INTERDIARIO',
      texto: 'Interdiario'
    },
    {
      codigo: 'SEMANAL',
      texto: 'Semanal'
    },
    {
      codigo: 'MENSUAL',
      texto: 'Mensual'
    },
  ]
  maxRespuestas = 1;

  validations = {
    'frecuencia': [
      { type: 'required', message: 'El nro de solicitud es requerido.' },
    ],
    'cantidad': [
      { type: 'required', message: 'El plazo de prestamo es requerido.' },
      { type: 'pattern', message: 'Este campo solo acepta números enteros.' },
      { type: 'notzero', message: 'El plazo debe ser mayor a 0.' }
    ]
  };

  constructor(private formBuilder: FormBuilder, private validator: ValidatorsService, private util: UtilService) {
    this.respuestaForm = this.formBuilder.group({
      respuesta: new FormArray([])
    });
  }

  ngOnInit() {

    this.util.respuestaFormChecker.subscribe(resp => {
      this.setRespuesta(this.respuestaForm.value);
    })

    this.needRespuestaObserver.subscribe(resp => {
      console.log(resp);
      if (resp == 'S') {
        this.addRespuesta();
      }
    });

    this.respuestaForm.statusChanges.subscribe(val => {
      if (val == 'VALID') {
        this.setRespuesta(this.respuestaForm.value)
      }
    })
  }

  get p() { return this.respuestaForm.controls; }
  get r() { return this.p.respuesta as FormArray; }

  addRespuesta() {
    if (this.r.length < this.maxRespuestas) {
      this.r.push(this.formBuilder.group({
        frecuencia: [''],
        cantidad: [''],
      }, { updateOn: 'blur'}));
    }
  }

  setRespuesta(values){
    if (this.respuestaForm.invalid) {
      this.util.respuestaFormObserver.next(false);
      this.respuestaForm.markAllAsTouched();
    } else {
      this.util.respuestaFormObserver.next(true);
      this.dataGetter.emit(values.respuesta[0]);
    }
  }

  removeRespuesta(i) {
    this.r.removeAt(i);
  }

}
