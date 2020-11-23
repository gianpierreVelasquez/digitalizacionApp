import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-dynamic-asegurado',
  templateUrl: './asegurado.component.html',
  styleUrls: ['./asegurado.component.scss']
})
export class AseguradoComponent implements OnInit {

  aseguradoForm: FormGroup;
  maxAsegurados = 2;

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
    'estadoCivil': [
      { type: 'required', message: 'El estado civil es requerido.' },
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
    'codPais': [
      { type: 'required', message: 'El pais es requerido.' },
    ],
    'codDepartamento': [
      { type: 'required', message: 'El departamento es requerido.' },
    ],
    'codProvincia': [
      { type: 'required', message: 'La provincia es requerida.' },
    ],
    'codDistrito': [
      { type: 'required', message: 'El distrito es requerido.' },
    ],
    'nomDomicilio': [
      { type: 'required', message: 'El domicilio es requerido.' },
    ],
    'email': [
      { type: 'required', message: 'El correo es requerido.' },
    ],
    'tlfNumero': [
      { type: 'required', message: 'El número de telefono es requerido.' },
    ],
    'tlfMovil': [
      { type: 'required', message: 'El número de celular es requerido.' },
    ],
    'talla': [
      { type: 'required', message: 'La talla es requerida.' },
    ],
    'peso': [
      { type: 'required', message: 'El peso es requerido.' },
    ],
    'codOcupacion': [
      { type: 'required', message: 'La ocupación es requerida.' }
    ]
  };


  @Input() cuestionarioData: any = [];

  dpsModalForm: FormGroup;

  headers = [
    {
      text: 'Nro',
      class: 'text-left'
    },
    {
      text: 'Preguntas',
      class: 'text-center'
    },
    {
      text: 'Selección',
      class: 'text-center'
    }
  ]

  codRespuesta = '';

  //Variable
  varConformacion: any;
  dpsChecker: boolean = false;

  constructor(private formBuilder: FormBuilder, private loc: Location, private util: UtilService) {
    this.aseguradoForm = this.formBuilder.group({
      asegurados: new FormArray([])
    });

    this.dpsModalForm = this.formBuilder.group({
      observaciones: new FormArray([])
    });
  }

  ngOnInit() {
    this.util.parentescoData.subscribe((data) => {
      this.parentescoList = data;
    })

    this.util.tipoDocData.subscribe((data) => {
      this.documentoList = data;
    })

    this.varConformacion = sessionStorage.getItem('codTipoConformacion');
    this.addExtraAsegurado();

    this.util.conformacionVar.subscribe((value) => {
      this.varConformacion = value;
      this.addExtraAsegurado();
    })

    //Verificar si el usuario tendra habilitado DPS
    this.util.dpsChecker.subscribe(value => {
      this.dpsChecker = value;
    })
  }

  get f() { return this.aseguradoForm.controls; }
  get t() { return this.f.asegurados as FormArray; }

  addExtraAsegurado() {
    this.t.reset();
    if (this.t.length < this.varConformacion) {
      for (let i = this.t.length; i < this.varConformacion; i++) {
        this.t.push(this.formBuilder.group({
          codParentesco: ['', Validators.required],
          tipDocum: ['', [Validators.required]],
          codDocum: ['', [Validators.required]],
          fecNacimiento: ['', [Validators.required]],
          estadoCivil: ['', [Validators.required]],
          nombre: ['', [Validators.required]],
          apePaterno: ['', [Validators.required]],
          apeMaterno: ['', [Validators.required]],
          mcaSexo: ['', [Validators.required]],
          codPais: ['', [Validators.required]],
          codDepartamento: ['', [Validators.required]],
          codProvincia: ['', [Validators.required]],
          codDistrito: ['', [Validators.required]],
          nomDomicilio: ['', [Validators.required]],
          refDireccion: [''],
          email: ['', [Validators.required]],
          tlfNumero: ['', [Validators.required]],
          tlfMovil: ['', [Validators.required]],
          talla: ['', [Validators.required]],
          peso: ['', [Validators.required]],
          codOcupacion: ['', [Validators.required]]
        }));
      }
    } else {
      for (let i = this.t.length; i >= this.varConformacion; i--) {
        this.t.removeAt(i);
      }
    }
  }

  setAsegurado(values) {
    if (this.aseguradoForm.invalid) {
      this.aseguradoForm.markAllAsTouched();
    } else {
      console.log(values);
    }
  }

  // removeAsegurado(i) {
  //   this.submitted = false;
  //   this.t.reset();
  //   this.t.removeAt(i);
  // }

  get d() { return this.dpsModalForm.controls; }
  get o() { return this.d.observaciones as FormArray; }

  addObservaciones() {
    if (this.o.length < this.maxAsegurados) {
      this.o.push(this.formBuilder.group({
        enfermedad: ['', Validators.required],
        fecha: ['', [Validators.required]],
        duracion: ['', [Validators.required]],
        clinica: ['', [Validators.required]],
        estado_actual: ['', [Validators.required]],
      }));
    }
  }

  setObservaciones(values) {

  }

  back() {
    this.loc.back();
  }

}
