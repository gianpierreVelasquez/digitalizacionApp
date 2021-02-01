import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgSelectConfig } from '@ng-select/ng-select';
import { env } from 'process';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { CombosService } from 'src/app/core/services/combos.service';
import { DigitalService } from 'src/app/core/services/digital.service';
import { LoginService } from 'src/app/core/services/login.service';
import { SessionService } from 'src/app/core/services/session.service';
import { SPINNER_TEXT, UtilService } from 'src/app/core/services/util.service';
import { ValidatorsService } from 'src/app/core/services/validators.service';
import { environment } from 'src/environments/environment';
import { Desgravamen, DireccionHelper } from '../../models/Desgravamen';

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

  direccionDistr: DireccionHelper;

  hasPlan: boolean = false;

  validations = {
    'codParentesco': [
      { type: 'required', message: 'El tipo de parentesco es requerido.' },
      { type: 'notnull', message: 'El valor ingresado no existe.' }
    ],
    'tipDocum': [
      { type: 'required', message: 'El tipo de documento es requerido.' },
      { type: 'notnull', message: 'El valor ingresado no existe.' }
    ],
    'codDocum': [
      { type: 'required', message: 'El número de documento es requerido.' },
      { type: 'minlength', message: 'Este campo debe contener mínimo 8 dígitos.' },
      { type: 'maxlength', message: 'Este campo debe contener máximo 12 dígitos.' },
      { type: 'pattern', message: 'Este campo debe contener solo caracteres numéricos.' }
    ],
    'fecNacimiento': [
      { type: 'required', message: 'La fecha de nacimiento es requerida.' },
    ],
    'estadoCivil': [
      { type: 'required', message: 'El estado civil es requerido.' },
      { type: 'notnull', message: 'El valor ingresado no existe.' }
    ],
    'nombre': [
      { type: 'required', message: 'Los nombres son requeridos.' },
      { type: 'minlength', message: 'Este campo debe contener mínimo 3 dígitos.' },
      { type: 'maxlength', message: 'Este campo debe contener máximo 100 dígitos.' },
      { type: 'whitespace', message: 'Este campo no puede recibir caracteres vacíos.' }
    ],
    'apePaterno': [
      { type: 'required', message: 'El apellido parterno es requerido.' },
      { type: 'minlength', message: 'Este campo debe contener mínimo 3 dígitos.' },
      { type: 'maxlength', message: 'Este campo debe contener máximo 50 dígitos.' },
      { type: 'whitespace', message: 'Este campo no puede recibir caracteres vacíos.' }
    ],
    'apeMaterno': [
      { type: 'required', message: 'El apellido marterno es  requerido.' },
      { type: 'minlength', message: 'Este campo debe contener mínimo 3 dígitos.' },
      { type: 'maxlength', message: 'Este campo debe contener máximo 50 dígitos.' },
      { type: 'whitespace', message: 'Este campo no puede recibir caracteres vacíos.' }
    ],
    'mcaSexo': [
      { type: 'required', message: 'El sexo es requerido.' },
      { type: 'notnull', message: 'El valor ingresado no existe.' }
    ],
    'nacionalidad': [
      { type: 'required', message: 'El pais es requerido.' },
    ],
    'email': [
      { type: 'required', message: 'El correo es requerido.' },
      { type: 'email', message: 'Debe ingresar el formato correcto.' }
    ],
    'tlfNumero': [
      { type: 'required', message: 'El número de telefono es requerido.' },
      { type: 'minlength', message: 'Este campo debe contener mínimo 7 dígitos.' },
      { type: 'maxlength', message: 'Este campo debe contener máximo 10 dígitos.' },
      { type: 'pattern', message: 'Este campo debe contener solo caracteres numéricos.' }
    ],
    'tlfMovil': [
      { type: 'required', message: 'El número de celular es requerido.' },
      { type: 'minlength', message: 'Este campo debe contener mínimo 9 dígitos.' },
      { type: 'maxlength', message: 'Este campo debe contener máximo 12 dígitos.' },
      { type: 'pattern', message: 'Este campo debe contener solo caracteres numéricos.' }
    ],
    'talla': [
      { type: 'required', message: 'La talla es requerida.' },
      { type: 'notzero', message: 'La talla debe ser mayor a 0.' }
    ],
    'peso': [
      { type: 'required', message: 'El peso es requerido.' },
      { type: 'notzero', message: 'El peso debe ser mayor a 0.' }
    ],
    'codOcupacion': [
      { type: 'required', message: 'La ocupación es requerida.' }
    ],
    'otroOcupacion': [
      { type: 'required', message: 'Este campo es requerido.' }
    ]
  };

  //Variable
  varConformacion: any;

  constructor(private formBuilder: FormBuilder, private session: SessionService, private util: UtilService, private config: NgSelectConfig, private digitalServ: DigitalService,
    private combosServ: CombosService, private validator: ValidatorsService, private loginServ: LoginService, private _authServ: AuthenticationService) {
    this.aseguradoForm = this.formBuilder.group({
      asegurados: new FormArray([])
    });

    this.config.notFoundText = 'No se encontraron registros';
  }

  async ngOnInit() {

    this.util.callServices.subscribe(resp => {
      if (resp == true && this.session.getSession(environment.KEYS.URL_PARAM) != null) {
        this.init();
      } else {
        this.util.hideSpinner();
      }
    });

    this.util.conformacionVar.subscribe((value) => {
      this.varConformacion = value;
      this.addExtraAsegurado();
    })

    //Chekc if plan is activated
    this.util.isPlanActivated.subscribe(resp => {
      this.hasPlan = resp;
    })
  }

  init() {
    Promise.all([
      this.obtenerTipoParentesco(),
      this.obtenerTipoDocumento(),
      this.obtenerTipoEstadoCivil(),
      this.obtenerGenero(),
      this.obtenerTipoProfesiones()
    ]).then((value) => {
      // nothing
    }).catch(err => {
      console.error(err)
      this.util.hideSpinner();
    });
  }

  async obtenerTipoParentesco() {
    await this.combosServ.obtenerTipoParentesco()
      .then(resp => {
        var data = resp.data;
        this.parentescoList = data;
      }).catch(err => {
        console.error(err);
      })
  }

  async obtenerTipoDocumento() {
    await this.combosServ.obtenerTipoDocumento()
      .then(resp => {
        var data = resp.data;
        this.documentoList = data;
      }).catch(err => {
        console.error(err);
      })
  }

  async obtenerTipoEstadoCivil() {
    await this.combosServ.obtenerEstadoCivil()
      .then(resp => {
        var data = resp.data;
        this.estadoCivilList = data;
      }).catch(err => {
        console.error(err);
      })
  }

  async obtenerGenero() {
    await this.combosServ.obtenerGenero()
      .then(resp => {
        var data = resp.data;
        this.generoList = data;
      }).catch(err => {
        console.error(err);
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
        console.error(err);
        this.profIsLoading = false;
      })
  }

  get f() { return this.aseguradoForm.controls; }
  get t() { return this.f.asegurados as FormArray; }

  addExtraAsegurado() {
    if (this.t.length < this.varConformacion) {
      for (let i = this.t.length; i < this.varConformacion; i++) {
        this.t.push(this.formBuilder.group({
          codParentesco: ['', [Validators.required, this.validator.notNull]],
          tipDocum: ['', [Validators.required, this.validator.notNull]],
          codDocum: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12), Validators.pattern("^[0-9]+$")]],
          fecNacimiento: ['', [Validators.required]],
          estadoCivil: [null, [Validators.required, this.validator.notNull]],
          nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), this.validator.noWhitespaceValidatorForString]],
          apePaterno: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
          apeMaterno: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
          mcaSexo: [null, [Validators.required, this.validator.notNull]],
          email: ['', [Validators.required, Validators.email]],
          tlfNumero: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10), Validators.pattern("^[0-9]+$")]],
          tlfMovil: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(12), Validators.pattern("^[0-9]+$")]],
          talla: ['', [Validators.required, this.validator.notZero]],
          peso: ['', [Validators.required, this.validator.notZero]],
          codOcupacion: [null, [Validators.required]],
          // otroOcupacion: [''],
          nacionalidad: ['PE'],
          direccion: [],
          cuestionario: [null]
        }));
      }

      this.displayAsegurados();

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
      if (this.util.cuestionarioIsSubmitted.value == true) {
        if (this.hasPlan == true) {
          this.next(null);
          this.session.setSession(environment.KEYS.INSURED, this.aseguradoForm.getRawValue());
        } else {
          this._authServ.checkTokenValidation();
          this.util.tokenNeedsUpdate.subscribe(async (resp) => {
            if (resp == true) {
              this.loginServ.getCredencials()
                .then(() => {
                  this.suscribirDesgravamen();
                })
                .catch(err => {
                  console.error(err)
                })
            } else {
              this.suscribirDesgravamen();
            }
          })
        }
      } else {
        this.util.warningAlert('Advertencia', 'Necesita rellenar la Declaración Personal de Salud del(los) asegurado(s).')
      }
    }
  }

  // onChangeOcupation(ev: any, i) {
  //   if (ev.texto == 'OTROS') {
  //     this.otroIsSelected = true;
  //   } else {
  //     this.otroIsSelected = false;
  //     this.t.controls[i].get('otroOcupacion').disable();
  //   }
  // }

  displayAsegurados() {
    var asegurados: any[] = this.session.getSession(environment.KEYS.PARAMS).asegurados;
    if (asegurados != [] || asegurados != null) {
      var aseguradoP = asegurados.find(x => x.codParentesco == 1);

      if (this.varConformacion == 2 && asegurados.length > 1) {
        var aseguradoS = asegurados.find(y => y.codParentesco != 1);

        this.t.controls[0]['controls'].codParentesco.setValue(this.util.propChecker(aseguradoP.codParentesco, this.parentescoList));
        this.t.controls[0]['controls'].tipDocum.setValue(this.util.propChecker(aseguradoP.tipDocum, this.documentoList));
        this.t.controls[0]['controls'].codDocum.setValue(aseguradoP.codDocum);
        this.t.controls[0]['controls'].nombre.setValue(aseguradoP.nombre);
        this.t.controls[0]['controls'].apePaterno.setValue(aseguradoP.apePaterno);
        this.t.controls[0]['controls'].apeMaterno.setValue(aseguradoP.apeMaterno);
        this.t.controls[0]['controls'].fecNacimiento.setValue(this.util.dateConverterToPlatform(aseguradoP.fecNacimiento));
        this.t.controls[0]['controls'].mcaSexo.setValue(this.util.propChecker(aseguradoP.mcaSexo, this.generoList));
        this.t.controls[0]['controls'].estadoCivil.setValue(this.util.propChecker(aseguradoP.estadoCivil, this.estadoCivilList));
        this.t.controls[0]['controls'].tlfMovil.setValue(aseguradoP.tlfMovil);
        this.t.controls[0]['controls'].direccion.setValue(aseguradoP.direccion);

        this.util.disabledFields(this.t.controls[0] as FormGroup);

        if (aseguradoS != undefined) {

          this.t.controls[1]['controls'].codParentesco.setValue(this.util.propChecker(aseguradoS.codParentesco, this.parentescoList));
          this.t.controls[1]['controls'].tipDocum.setValue(this.util.propChecker(aseguradoS.tipDocum, this.documentoList));
          this.t.controls[1]['controls'].codDocum.setValue(aseguradoS.codDocum);
          this.t.controls[1]['controls'].nombre.setValue(aseguradoS.nombre);
          this.t.controls[1]['controls'].apePaterno.setValue(aseguradoS.apePaterno);
          this.t.controls[1]['controls'].apeMaterno.setValue(aseguradoS.apeMaterno);
          this.t.controls[1]['controls'].fecNacimiento.setValue(this.util.dateConverterToPlatform(aseguradoS.fecNacimiento));
          this.t.controls[1]['controls'].mcaSexo.setValue(this.util.propChecker(aseguradoS.mcaSexo, this.generoList));
          this.t.controls[1]['controls'].estadoCivil.setValue(this.util.propChecker(aseguradoS.estadoCivil, this.estadoCivilList));
          this.t.controls[1]['controls'].tlfMovil.setValue(aseguradoS.tlfMovil);
          this.t.controls[1]['controls'].direccion.setValue(aseguradoS.direccion);

          this.util.disabledFields(this.t.controls[1] as FormGroup);

        } else {

          this.t.controls[1]['controls'].codParentesco.setValue('');
          this.t.controls[1]['controls'].tipDocum.setValue('');
          this.t.controls[1]['controls'].codDocum.setValue('');
          this.t.controls[1]['controls'].nombre.setValue('');
          this.t.controls[1]['controls'].apePaterno.setValue('');
          this.t.controls[1]['controls'].apeMaterno.setValue('');
          this.t.controls[1]['controls'].fecNacimiento.setValue('');
          this.t.controls[1]['controls'].mcaSexo.setValue('');
          this.t.controls[1]['controls'].estadoCivil.setValue('');
          this.t.controls[1]['controls'].tlfMovil.setValue('');
          this.t.controls[1]['controls'].direccion.setValue('');
        }

      } else {

        this.t.controls[0]['controls'].codParentesco.setValue(this.util.propChecker(aseguradoP.codParentesco, this.parentescoList));
        this.t.controls[0]['controls'].tipDocum.setValue(this.util.propChecker(aseguradoP.tipDocum, this.documentoList));
        this.t.controls[0]['controls'].codDocum.setValue(aseguradoP.codDocum);
        this.t.controls[0]['controls'].nombre.setValue(aseguradoP.nombre);
        this.t.controls[0]['controls'].apePaterno.setValue(aseguradoP.apePaterno);
        this.t.controls[0]['controls'].apeMaterno.setValue(aseguradoP.apeMaterno);
        this.t.controls[0]['controls'].fecNacimiento.setValue(this.util.dateConverterToPlatform(aseguradoP.fecNacimiento));
        this.t.controls[0]['controls'].mcaSexo.setValue(this.util.propChecker(aseguradoP.mcaSexo, this.generoList));
        this.t.controls[0]['controls'].estadoCivil.setValue(this.util.propChecker(aseguradoP.estadoCivil, this.estadoCivilList));
        this.t.controls[0]['controls'].tlfMovil.setValue(aseguradoP.tlfMovil);
        this.t.controls[0]['controls'].direccion.setValue(aseguradoP.direccion);

        this.util.disabledFields(this.t.controls[0] as FormGroup);
      }
    }
  }

  setFechaNacimiento(ev: any, index) {
    if (index == 0) {
      var date = this.util.dateConverterToServer(ev.target.value);
      var data = {
        'Fecha_Nacimiento': date,
        'Importe_Cumulo': this.session.getSession(environment.KEYS.REQUEST).impCumulo
      }
      this.verifyToken(data)
    }
  }

  verifyToken(dataDPS) {
    this._authServ.checkTokenValidation();
    this.util.tokenNeedsUpdate.subscribe(async (resp) => {
      if (resp == true) {
        this.loginServ.getCredencials()
          .then(() => {
            this.verifyDPS(this.session.getSession(environment.KEYS.REQUEST).numPolizaGrupo, dataDPS);
          })
          .catch(err => {
            console.error(err)
          })
      } else {
        this.verifyDPS(this.session.getSession(environment.KEYS.REQUEST).numPolizaGrupo, dataDPS);
      }
    })
  }

  async verifyDPS(numPolizaGrupo: any, data: any) {
    if (this.util.dpsObserver.getValue() === false) {
      this.util.showSpinner();
      this.util.setSpinnerTextValue(SPINNER_TEXT.DEFAULT);
      this.digitalServ.requiereDPS(numPolizaGrupo, data)
        .then(resp => {
          this.util.dpsObserver.next(true);
          var data = resp.Resultado;
          if (data == 'N') {
            this.util.dpsChecker.next(false);
            this.util.cuestionarioIsSubmitted.next(true);
          } else {
            this.util.dpsChecker.next(true);
            this.util.cuestionarioIsSubmitted.next(false);
          }
          this.util.hideSpinner();
        }).catch(err => {
          console.error(err);
          this.util.hideSpinner();
        })
    }
  }


  getCuestionarioData(ev: any, i) {
    setTimeout(() => {
      this.t.controls[i]['controls'].cuestionario.setValue(ev);
    });
  }

  getDireccionData(ev: any, i) {
    setTimeout(() => {
      this.t.controls[i]['controls'].direccion.setValue(ev.direccion);
    });
  }

  back($event: any) {
    this.backButton.emit($event);
  }

  next($event: any) {
    this.nextButton.emit($event);
  }

  suscribirDesgravamen() {
    this.util.showSpinner();

    var desgravamen: Desgravamen = {
      cabecera: this.util.desgravamenData.getValue().cabecera,
      solicitud: this.util.desgravamenData.getValue().solicitud,
      producto: this.util.desgravamenData.getValue().producto,
      riesgoDesgravamen: this.util.desgravamenData.getValue().riesgoDesgravamen,
      asegurados: this.aseguradoForm.getRawValue(),
      beneficiarios: null
    }

    this.digitalServ.suscribirDesgravamen(desgravamen)
      .then(resp => {
        this.util.correctAlert('Correcto', 'El formulario fue enviado exitosamente.')
      })
      .catch(err => {
        console.error(err);
      })
  }

}

