import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgSelectConfig } from '@ng-select/ng-select';
import { CombosService } from 'src/app/core/services/combos.service';
import { DigitalService } from 'src/app/core/services/digital.service';
import { SessionService } from 'src/app/core/services/session.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ValidatorsService } from 'src/app/core/services/validators.service';
import { environment } from 'src/environments/environment';

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
      { type: 'minlength', message: 'Este campo debe contener 8 dígitos.' },
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
    'nacionalidad': [
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
      { type: 'notzero', message: 'La talla debe ser mayor a 0.' },
    ],
    'peso': [
      { type: 'required', message: 'El peso es requerido.' },
      { type: 'notzero', message: 'El peso debe ser mayor a 0.' },
    ],
    'codOcupacion': [
      { type: 'required', message: 'La ocupación es requerida.' }
    ],
    'otroOcupacion': [
      { type: 'required', message: 'Este campo es requerido.' }
    ]
  };

  cuestionarioForm: FormGroup;
  cuestionarioData: any[] = [];

  //Variable
  varConformacion: any;
  varDireccion: number = 1; // Por si se solicitan en un futuro mas direcciones anexadas a un solo asegurado
  dpsChecker: boolean = false;

  direccionHelper: any;

  constructor(private formBuilder: FormBuilder, private session: SessionService, private util: UtilService, private config: NgSelectConfig, private digitalServ: DigitalService,
    private combosServ: CombosService, private validator: ValidatorsService) {
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
    }).catch(reason => {
      console.log(reason)
      this.util.hideSpinner();
    });

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
          codDocum: ['', [Validators.required, Validators.minLength(8)]],
          fecNacimiento: ['', [Validators.required]],
          estadoCivil: ['', [Validators.required]],
          nombre: ['', [Validators.required]],
          apePaterno: ['', [Validators.required]],
          apeMaterno: ['', [Validators.required]],
          mcaSexo: ['', [Validators.required]],
          email: ['', [Validators.required]],
          tlfNumero: ['', [Validators.required]],
          tlfMovil: ['', [Validators.required]],
          talla: ['', [Validators.required, this.validator.notZero]],
          peso: ['', [Validators.required, this.validator.notZero]],
          codOcupacion: [null, [Validators.required]],
          otroOcupacion: [''],
          nacionalidad: ['PE'],
          direccion: new FormArray([])
        }));
      }
      this.addDireccion();
    } else {
      for (let i = this.t.length; i >= this.varConformacion; i--) {
        this.t.removeAt(i);
      }
    }
  }

  get d() { return this.t.controls[0]['controls'].direccion as FormArray; }

  addDireccion() {
    // this.direccionHelper = this.t.controls[aseguradoIndex]['controls'].direccion as FormArray;
    if (this.d.length < this.varDireccion) {
      for (let i = this.d.length; i < this.varDireccion; i++) {
        this.d.push(this.formBuilder.group({
            codPais: ['PE', [Validators.required]],
            codDepartamento: [null, [Validators.required]],
            codProvincia: [{ value: null, disabled: true }, [Validators.required]],
            codDistrito: [{ value: null, disabled: true }, [Validators.required]],
            nomDomicilio: ['', [Validators.required]],
            refDireccion: ['']
        }));
      }
    } else {
      for (let i = this.t.length; i >= this.varConformacion; i--) {
        this.t.removeAt(i);
      }
    }
    this.displayAsegurados();
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

    this.d.controls[i]['controls'].codProvincia.setValue(null);
    this.d.controls[i]['controls'].codProvincia.disable();

    this.d.controls[i]['controls'].codDistrito.setValue(null);
    this.d.controls[i]['controls'].codDistrito.disable();

    await this.combosServ.obtenerProvincia(codDepartamento)
      .then(resp => {
        this.provinciaList = resp.data;
        this.provIsLoading = false;
        this.d.controls[i]['controls'].codProvincia.enable();
      }).catch(err => {
        console.log(err);
        this.provIsLoading = false;
      })
  }

  async obtenerDistrito(ev: any, i) {
    var codDistrito = ev.codigo;

    this.distIsLoading = true;

    this.d.controls[i]['controls'].codDistrito.setValue(null);
    this.d.controls[i]['controls'].codDistrito.disable();

    await this.combosServ.obtenerDistrito(codDistrito)
      .then(resp => {
        this.distritoList = resp.data;
        this.distIsLoading = false;
        this.d.controls[i]['controls'].codDistrito.enable();
      }).catch(err => {
        console.log(err);
        this.distIsLoading = false;
      })
  }

  setAsegurado(values) {
    if (this.aseguradoForm.invalid) {
      this.aseguradoForm.markAllAsTouched();
    } else {
      if(this.dpsChecker == true){
        console.log(values);
        this.next(null);
      }else {
        console.log(values);
      }
    }
  }

  onChangeOcupation(ev: any, i) {
    if (ev.texto == 'OTROS') {
      this.otroIsSelected = true;
    } else {
      this.otroIsSelected = false;
      this.t.controls[i].get('otroOcupacion').disable();
    }
  }

  displayAsegurados(){
    var asegurados:any= this.session.getSession(environment.KEYS.PARAMS).asegurados;
    if(asegurados != [] || asegurados != null){
      if(asegurados.length > 1){
        var aseguradoP = asegurados.find(x => x.codParentesco == 1);
        var aseguradoS = asegurados.find(y => y.codParentesco != 1);
  
        this.t.controls[0].get('codParentesco').setValue(aseguradoP.codParentesco);
        this.t.controls[0].get('tipDocum').setValue(aseguradoP.tipDocum);
        this.t.controls[0].get('codDocum').setValue(aseguradoP.codDocum);
        this.t.controls[0].get('nombre').setValue(aseguradoP.nombre);
        this.t.controls[0].get('apePaterno').setValue(aseguradoP.apePaterno);
        this.t.controls[0].get('apeMaterno').setValue(aseguradoP.apeMaterno);
        this.t.controls[0].get('mcaSexo').setValue(aseguradoP.mcaSexo);
        this.t.controls[0].get('estadoCivil').setValue(aseguradoP.estadoCivil);
        this.t.controls[0].get('tlfMovil').setValue(aseguradoP.tlfMovil);
  
        this.d.controls[0]['controls'].codDepartamento.setValue(aseguradoP.direccion[0].codDepartamento.toString());
        this.obtenerProvincia({codigo:aseguradoP.direccion[0].codDepartamento.toString()},0);
        this.d.controls[0]['controls'].codProvincia.setValue(aseguradoP.direccion[0].codProvincia.toString());
        this.obtenerDistrito({codigo:aseguradoP.direccion[0].codProvincia.toString()},0);
        this.d.controls[0]['controls'].codDistrito.setValue(aseguradoP.direccion[0].codDistrito.toString());
        this.d.controls[0]['controls'].nomDomicilio.setValue(aseguradoP.direccion[0].nomDomicilio);

      }
    }
  }

  get c() { return this.cuestionarioForm.controls; }
  get p() { return this.c.preguntas as FormArray; }

  addPreguntas() {
    if (this.p.length < this.cuestionarioData.length) {
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
