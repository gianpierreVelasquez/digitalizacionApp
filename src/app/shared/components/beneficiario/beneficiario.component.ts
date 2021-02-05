import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { CombosService } from 'src/app/core/services/combos.service';
import { DigitalService } from 'src/app/core/services/digital.service';
import { LoginService } from 'src/app/core/services/login.service';
import { SessionService } from 'src/app/core/services/session.service';
import { SPINNER_TEXT, UtilService } from 'src/app/core/services/util.service';
import { ValidatorsService } from 'src/app/core/services/validators.service';
import { environment } from 'src/environments/environment';
import { Desgravamen } from '../../models/Desgravamen';

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

  parentescoList: any = [];
  documentoList: any = [];
  estadoCivilList: any = [];
  generoList: any = [];

  validations = {
    'codParentesco': [
      { type: 'required', message: 'El tipo de parentesco es requerido.' },
    ],
    'tipDocum': [
      { type: 'required', message: 'El tipo de documento es requerido.' },
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
    'porcParticipacion': [
      { type: 'required', message: 'El porcentaje de participación es requerido.' },
      { type: 'notzero', message: 'El porcentaje de participación debe ser mayor a 0.' },
      { type: 'nothundred', message: 'El porcentaje de participación no puede ser mayor a 100%.' }
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
    ],
    'estadoCivil': [
      { type: 'required', message: 'El estado civil es requerido.' },
    ]
  };

  constructor(private formBuilder: FormBuilder, private session: SessionService, private validator: ValidatorsService, private util: UtilService,
    private combosServ: CombosService, private digitalServ: DigitalService, private _authServ: AuthenticationService, private loginServ: LoginService) {
    this.beneficiarioForm = this.formBuilder.group({
      beneficiarios: new FormArray([])
    });
  }

  ngOnInit() {

    this.util.callServices.subscribe(resp => {
      if (resp == true && this.session.getSession(environment.KEYS.URL_PARAM) != null) {
        this.init();
      } else {
        this.util.hideSpinner();
      }
    });

    this.addExtraBeneficiario();
  }

  init() {
    Promise.all([
      this.obtenerTipoParentesco(),
      this.obtenerTipoDocumento(),
      this.obtenerTipoEstadoCivil(),
      this.obtenerGenero()
    ]).then((value) => {
      // nothing
    }).catch(reason => {
      console.log(reason)
    });
  }


  get f() { return this.beneficiarioForm.controls; }
  get t() { return this.f.beneficiarios as FormArray; }

  addExtraBeneficiario() {
    if (this.t.length < this.maxBeneficiarios) {
      this.t.push(this.formBuilder.group({
        codParentesco: ['', Validators.required],
        tipDocum: ['', [Validators.required]],
        codDocum: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12), Validators.pattern("^[0-9]+$")]],
        fecNacimiento: ['', [Validators.required]],
        porcParticipacion: ['', [Validators.required, this.validator.notZero, this.validator.notHundred]],
        nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), this.validator.noWhitespaceValidatorForString]],
        apePaterno: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), this.validator.noWhitespaceValidatorForString]],
        apeMaterno: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), this.validator.noWhitespaceValidatorForString]],
        mcaSexo: ['', [Validators.required]],
        estadoCivil: ['', [Validators.required]],
      }));
    } else {
      this.util.warningAlert('Advertencia', 'Solo se puede tener un máximo de 3 beneficiarios.')
    }
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

  checkParticipacion() {
    var totalParticipation = 0;
    for (let i = 0; i < this.t.length; i++) {
      const objPart = this.t.controls[i]['controls'].porcParticipacion.value;
      totalParticipation += objPart;
    }

    if (totalParticipation != 100) {
      this.util.warningAlert('Advertencia', 'El total de participación debe sumar 100%.')
      return false
    } else {
      return true
    }
  }

  setBeneficiario(values) {
    if (this.beneficiarioForm.invalid) {
      this.beneficiarioForm.markAllAsTouched();
    } else {
      if (this.checkParticipacion() == true) {
        this.suscribirDesgravamen();
      }
    }
  }

  removeBeneficiario(i) {
    this.submitted = false;
    this.t.removeAt(i);
  }

  back($event: any) {
    this.backButton.emit($event);
  }

  suscribirDesgravamen() {
    this.util.showSpinner();
    this.util.setSpinnerTextValue(SPINNER_TEXT.DESGRAVAMEN);

    var beneficiarios = this.beneficiarioForm.value.beneficiarios;
    var desgravamen: Desgravamen = {
      cabecera: this.util.desgravamenData.getValue().cabecera,
      solicitud: this.util.desgravamenData.getValue().solicitud,
      producto: this.util.desgravamenData.getValue().producto,
      riesgoDesgravamen: this.util.desgravamenData.getValue().riesgoDesgravamen,
      asegurados: this.session.getSession(environment.KEYS.INSURED),
      beneficiarios: beneficiarios.map(e => ({ ...e, fecNacimiento: this.util.dateConverterToServer(e.fecNacimiento) }))
    }

    this.digitalServ.suscribirDesgravamen(desgravamen)
      .then(resp => {
        this.util.correctAlert('Correcto', 'El formulario fue enviado exitosamente.')
        this.util.hideSpinner();
      })
      .catch(err => {
        console.error(err);
        this.util.hideSpinner();
      })
  }

}
