import { Location } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgSelectConfig } from '@ng-select/ng-select';
import { CombosService } from 'src/app/core/services/combos.service';
import { DigitalService } from 'src/app/core/services/digital.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-dynamic-asegurado',
  templateUrl: './asegurado.component.html',
  styleUrls: ['./asegurado.component.scss']
})
export class AseguradoComponent implements OnInit {

  @Output() backButton: EventEmitter<string> = new EventEmitter<string>();
  @Output() nextButton: EventEmitter<string> = new EventEmitter<string>();

  aseguradoForm: FormGroup;
  maxAsegurados = 2;

  parentescoList: any = [];
  documentoList: any = [];
  estadoCivilList: any = [];
  generoList: any = [];
  departamentoList: any = [];
  provinciaList: any = [];
  distritoList: any = [];
  profesionesList: any = [];

  depaIsLoading: boolean = false;
  provIsLoading: boolean = false;
  distIsLoading: boolean = false;

  profIsLoading: boolean = false;
  otroIsSelected: boolean = false;

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

  cuestionarioForm: FormGroup;
  cuestionarioData: any[] = [];

  //Variable
  varConformacion: any;
  dpsChecker: boolean = false;

  constructor(private formBuilder: FormBuilder, private loc: Location, private util: UtilService, private config: NgSelectConfig,private digitalServ: DigitalService,
    private combosServ: CombosService) {
    this.aseguradoForm = this.formBuilder.group({
      asegurados: new FormArray([])
    });

    this.cuestionarioForm = this.formBuilder.group({
      preguntas: new FormArray([])
    });

    this.config.notFoundText = 'No se encontraron registros';
  }

  async ngOnInit() {

    Promise.all([
      this.obtenerTipoParentesco(),
      this.obtenerTipoDocumento(),
      this.obtenerTipoEstadoCivil(),
      this.obtenerGenero(),
      this.obtenerDepartamento(),
      this.obtenerTipoProfesiones()
    ]).then((value) => {
      console.log(value);
    }).catch(reason => {
      console.log(reason)
      this.util.hideSpinner();
    });

    this.varConformacion = sessionStorage.getItem('codTipoConformacion');
    this.addExtraAsegurado();

    this.util.conformacionVar.subscribe((value) => {
      this.varConformacion = value;
      this.addExtraAsegurado();
    })

    //Verificar si el usuario tendra habilitado DPS
    this.dpsChecker = this.util.isPlanActivated.getValue();

    this.recuperarCuestionario();
  }

  async obtenerTipoParentesco() {
    await this.combosServ.obtenerTipoParentesco()
    .then(resp => {
      var data = resp.data;
      this.parentescoList = data;
    }).catch(err => {
      console.log(err);
    })
  }

  async obtenerTipoDocumento() {
    await this.combosServ.obtenerTipoDocumento()
    .then(resp => {
      var data = resp.data;
      console.log(data);
      this.documentoList = data;
    }).catch(err => {
      console.log(err);
    })
  }

  async obtenerTipoEstadoCivil() {
    await this.combosServ.obtenerEstadoCivil()
    .then(resp => {
      var data = resp.data;
      this.estadoCivilList = data;
    }).catch(err => {
      console.log(err);
    })
  }

  async obtenerGenero() {
    await this.combosServ.obtenerGenero()
    .then(resp => {
      var data = resp.data;
      this.generoList = data;
    }).catch(err => {
      console.log(err);
    })
  }

  async obtenerDepartamento() {

    this.depaIsLoading = true;

    await this.combosServ.obtenerDepartamento()
    .then(resp => {
      var arr = resp.data;
      this.departamentoList = arr;
      this.depaIsLoading = false;
    }).catch(err => {
      console.log(err);
      this.depaIsLoading = false;
    })
  }

  async obtenerProvincia(ev: any, i) {
    var codDepartamento = ev.codigo;

    this.provIsLoading = true;

    this.t.controls[i].get('codProvincia').setValue(null);
    this.t.controls[i].get('codProvincia').disable();

    this.t.controls[i].get('codDistrito').setValue(null);
    this.t.controls[i].get('codDistrito').disable();

    await this.combosServ.obtenerProvincia(codDepartamento)
      .then(resp => {
        this.provinciaList = resp.data;
        this.provIsLoading = false;
        this.t.controls[i].get('codProvincia').enable();
      }).catch(err => {
        console.log(err);
        this.provIsLoading = false;
      })
  }

  async obtenerDistrito(ev: any, i) {
    var codDistrito = ev.codigo;

    this.distIsLoading = true;

    this.t.controls[i].get('codDistrito').setValue(null);
    this.t.controls[i].get('codDistrito').disable();

    await this.combosServ.obtenerDistrito(codDistrito)
      .then(resp => {
        this.distritoList = resp.data;
        this.distIsLoading = false;
        this.t.controls[i].get('codDistrito').enable();
      }).catch(err => {
        console.log(err);
        this.distIsLoading = false;
      })
  }

  async obtenerTipoProfesiones() {
    this.profIsLoading = true;
    await this.combosServ.obtenerProfesiones()
    .then(resp => {
      var arr = resp.data;
      this.profesionesList = arr;
      this.profIsLoading = false;
    }).catch(err => {
      console.log(err);
      this.profIsLoading = false;
    })
  }

  async recuperarCuestionario(){
    this.digitalServ.recuperarCuestionario(21)
    .then(resp => {
      var data = resp['Resultado'];
      this.cuestionarioData = data;
      this.addPreguntas();
    }).catch(err => {
      console.log(err);
    })
  }

  get f() { return this.aseguradoForm.controls; }
  get t() { return this.f.asegurados as FormArray; }

  addExtraAsegurado() {
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
          codPais: [{ value: 'PE', disabled: true }, [Validators.required]],
          codDepartamento: [null, [Validators.required]],
          codProvincia: [{ value: null, disabled: true }, [Validators.required]],
          codDistrito: [{ value: null, disabled: true }, [Validators.required]],
          nomDomicilio: ['', [Validators.required]],
          refDireccion: [''],
          email: ['', [Validators.required]],
          tlfNumero: ['', [Validators.required]],
          tlfMovil: ['', [Validators.required]],
          talla: ['', [Validators.required]],
          peso: ['', [Validators.required]],
          codOcupacion: [null, [Validators.required]]
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
      if(this.dpsChecker == true){
        console.log(values);
        this.next(null);
      }else {
        alert('Aqui termina todo :v')
      }
    }
  }

  onChangeOcupation(ev: any) {
    if (ev.texto == 'OTROS') {
      this.otroIsSelected = true;
    } else {
      this.otroIsSelected = false;
    }
  }

  // removeAsegurado(i) {
  //   this.submitted = false;
  //   this.t.reset();
  //   this.t.removeAt(i);
  // }

  get c() { return this.cuestionarioForm.controls; }
  get p() { return this.c.preguntas as FormArray; }

  addPreguntas() {
    if (this.p.length < this.cuestionarioData.length) {
      console.log(this.p.length);
      for (let i = this.p.length; i < this.cuestionarioData.length; i++) {
        this.p.push(this.formBuilder.group({
          codPregunta: [parseInt(this.cuestionarioData[i].CodigoPregunta), [Validators.required]],
          desPregunta: [{value: this.cuestionarioData[i].DescripcionPregunta, disabled: true}],
          codRespuesta: ['N', [Validators.required]],
          descRespuesta: [null]
        }));
      }
    }
  }

  setCuestionario(values) {
    if (this.cuestionarioForm.invalid) {
      this.cuestionarioForm.markAllAsTouched();
    } else {
      // values.preguntas.forEach(function(v){ delete v.desPregunta });
      console.log(values);
    }
    // console.log(values.preguntas);
    // values.preguntas.forEach(function(v){ delete v.desPregunta });
    // console.log(values.preguntas);
  }

  back($event: any) {
    this.backButton.emit($event);
  }

  next($event: any) {
    this.nextButton.emit($event);
  }

}
