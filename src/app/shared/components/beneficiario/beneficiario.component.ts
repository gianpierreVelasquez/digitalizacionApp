import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-dynamic-beneficiario',
  templateUrl: './beneficiario.component.html',
  styleUrls: ['./beneficiario.component.scss']
})
export class BeneficiarioComponent implements OnInit {

  @Output() backButton: EventEmitter<string> = new EventEmitter<string>();

  beneficiarioForm: FormGroup;
  submitted = false;

  maxBeneficiarios = 3;
  totalParticipation = 0;
  minValueDependOfLength = 0;

  parentescoList: any = [];
  documentoList: any = [];

  validations = {
    'codParentesco': [
      { type: 'required', message: 'El tipo de parentesco es requerido.' },
    ],
    'tipDocum': [
      { type: 'required', message: 'El tipo de documento es requerido.' },
    ],
    'codDocum': [
      { type: 'required', message: 'El número de documento es requerido.' },
    ],
    'fecNacimiento': [
      { type: 'required', message: 'La fecha de nacimiento es requerida.' },
    ],
    'porcParticipacion': [
      { type: 'required', message: 'El porcentaje de participación es requerido.' },
    ],
    'nombre': [
      { type: 'required', message: 'Los nombres son requeridos.' },
    ],
    'apePaterno': [
      { type: 'required', message: 'El apellido parterno es requerido.' },
    ],
    'apeMaterno': [
      { type: 'required', message: 'El apellido marterno es  requerido.' },
    ],
    'mcaSexo': [
      { type: 'required', message: 'El sexo es requerido.' },
    ],
    'estadoCivil': [
      { type: 'required', message: 'El estado civil es requerido.' },
    ]
  };

  constructor(private formBuilder: FormBuilder, private loc: Location, private util: UtilService) {
    this.beneficiarioForm = this.formBuilder.group({
      beneficiarios: new FormArray([])
    });
  }

  ngOnInit() {
    this.util.parentescoData.subscribe((data) => {
      this.parentescoList = data;
    })

    this.util.tipoDocData.subscribe((data) => {
      this.documentoList = data;
    })


    this.addExtraBeneficiario();
  }

  get f() { return this.beneficiarioForm.controls; }
  get t() { return this.f.beneficiarios as FormArray; }

  addExtraBeneficiario() {
    if (this.t.length < this.maxBeneficiarios) {
      this.t.push(this.formBuilder.group({
        codParentesco: ['', Validators.required],
        tipDocum: ['', [Validators.required]],
        codDocum: ['', [Validators.required]],
        fecNacimiento: ['', [Validators.required]],
        porcParticipacion: ['', [Validators.required]],
        nombre: ['', [Validators.required]],
        apePaterno: ['', [Validators.required]],
        apeMaterno: ['', [Validators.required]],
        mcaSexo: ['', [Validators.required]],
        estadoCivil: ['', [Validators.required]],
      }));
    } else {
      this.util.warningAlert('Advertencia', 'Solo se puede tener un máximo de 3 beneficiarios.')
    }
  }

  setParticipacion(index) {
    let currentPercentage:number = 0; let nextTotalPercentage:number = 0;
    var beneficiarios = this.beneficiarioForm.get('beneficiarios').value;
    for (let i = 0; i < beneficiarios.length; i++) {
      currentPercentage = beneficiarios[i].porcParticipacion - 0;
      if (!isNaN(currentPercentage)) {
        this.totalParticipation += currentPercentage;
      }
    }

    nextTotalPercentage = this.totalParticipation + currentPercentage;

    if (nextTotalPercentage <= 100) {

    }

    // this.t.at(index).get('porcParticipacion').setValidators([Validators.required, Validators.min(100)]);
  }

  onSubmit(values) {
    if (this.beneficiarioForm.invalid) {
      this.beneficiarioForm.markAllAsTouched();
    } else {
      console.log(values);
    }
  }

  removeBeneficiario(i) {
    this.submitted = false;
    this.t.reset();
    this.t.removeAt(i);
  }

  volver( $event:any ){
    this.backButton.emit($event);
  }

}
