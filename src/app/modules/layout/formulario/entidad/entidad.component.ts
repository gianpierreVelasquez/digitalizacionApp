import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { CombosService } from 'src/app/core/services/combos.service';
import { DigitalService } from 'src/app/core/services/digital.service';
import { LoginService } from 'src/app/core/services/login.service';
import { SessionService } from 'src/app/core/services/session.service';
import { SPINNER_TEXT, UtilService } from 'src/app/core/services/util.service';
import { ValidatorsService } from 'src/app/core/services/validators.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-entidad',
  templateUrl: './entidad.component.html',
  styleUrls: ['./entidad.component.scss']
})
export class EntidadComponent implements OnInit {

  entidadForm: FormGroup;

  //Operadores
  conformacion: any;
  moneda: string = '';
  amountSign: string = '';

  //Listas
  conformacionList: any;
  monedaList: any;

  parameterId: string;
  codApp: string;

  validations = {
    'nroSolicitudCaja': [
      { type: 'required', message: 'El nro de solicitud es requerido.' },
    ],
    'codTipoConformacion': [
      { type: 'required', message: 'El tipo de conformación es requerido.' },
      { type: 'notnull', message: 'El valor ingresado no existe.' }
    ],
    'codMonedaPrestamo': [
      { type: 'required', message: 'El tipo de moneda prestamo es requerido.' },
      { type: 'notnull', message: 'El valor ingresado no existe.' }
    ],
    'plazoPrestamo': [
      { type: 'required', message: 'El plazo de prestamo es requerido.' },
      { type: 'pattern', message: 'Este campo solo acepta números enteros.' },
      { type: 'notzero', message: 'El plazo debe ser mayor a 0.' }
    ],
    'impPrestamo': [
      { type: 'required', message: 'El importe del prestamo es requerido.' }
    ],
    'codigoUsuario': [
      { type: 'required', message: 'El funcionario del canal es requerido.' }
    ]
  };

  constructor(private session: SessionService, private util: UtilService, private combosServ: CombosService, private digitalServ: DigitalService, private fb: FormBuilder, private validator: ValidatorsService,
    private auth: AuthenticationService, private route: ActivatedRoute, private loginServ: LoginService) {
    this.entidadForm = this.fb.group({
      nroSolicitudCaja: ['', [Validators.required]],
      codTipoConformacion: ['', [Validators.required, this.validator.notNull]],
      codMonedaPrestamo: ['', [Validators.required, this.validator.notNull]],
      plazoPrestamo: ['', [Validators.required, Validators.pattern("^[0-9]+$"), this.validator.notZero]],
      impPrestamo: ['', [Validators.required]],
      codCanal: [''],
      codigoUsuario: ['', [Validators.required]]
    }, { updateOn: 'blur' });

    this.route.queryParams.subscribe(params => {
      var obj = JSON.parse(JSON.stringify(params));
      this.parameterId = obj['idParam'];
      this.codApp = obj['codApp'];
      this.session.setSession(environment.KEYS.URL_PARAM, this.parameterId);
      this.session.setSession(environment.KEYS.CODE_APP, this.codApp);
    });
  }

  ngOnInit() {

    this.getToken();

    this.util.entidadFormChecker.subscribe(resp => {
      this.setEntidad(this.entidadForm.value)
    })

    this.entidadForm.statusChanges.subscribe(val => {
      if (val == 'VALID') {
        this.util.disabledFields(this.entidadForm);
        this.setEntidad(this.entidadForm.value)
      }
    })
  }

  getToken() {
    this.loginServ.getCredencials().then(resp => {
      this.util.callServices.next(true);
      this.session.setSession(environment.KEYS.TOKEN, resp.token);
      setTimeout(() => {
        this.init();
      }, 1000)
    }).catch(err => {
      console.log(err);
      this.util.callServices.next(false)
    })
  }

  async init() {
    this.util.showSpinner();
    Promise.all([
      this.obtenerTipoConformación(),
      this.obtenerTipoMoneda(),
    ]).then((value) => {
      this.obtenerParametros();
    }).catch(reason => {
      console.log(reason)
    });
  }

  async obtenerParametros() {
    if (this.parameterId != '') {
      this.util.showSpinner()
      this.util.setSpinnerTextValue(SPINNER_TEXT.PARAMETERS);
      this.digitalServ.obtenerParametros(this.parameterId)
        .then(resp => {
          var data = resp;
          this.util.desgravamenData.next(data);
          this.session.setSession(environment.KEYS.PARAMS, data);
          this.displayParamsEntidad();
          this.util.hideSpinner();
        }).catch(err => {
          console.log(err);
          this.util.hideSpinner();
        })
    } else {
      this.util.warningAlert('Advertencia', 'El parámetro principal {id_parameter} en la URL no esta asignado')
    }
  }

  async obtenerTipoConformación() {
    await this.combosServ.obtenerTipoConformación()
      .then(resp => {
        var data = resp.data;
        this.conformacionList = data;
      }).catch(err => {
        console.log(err);
      })
  }

  async obtenerTipoMoneda() {
    await this.combosServ.obtenerTipoMoneda()
      .then(resp => {
        var data = resp.data;
        this.monedaList = data;
      }).catch(err => {
        console.log(err);
      })
  }

  setEntidad(values) {
    if (this.entidadForm.invalid) {
      this.entidadForm.markAllAsTouched();
      this.util.entidadFormObserver.next(false)
    } else {
      console.log(values);
      this.util.entidadFormObserver.next(true);
      this.session.setSession(environment.KEYS.ENTITY, values);
    }
  }

  setConformacion(ev: any) {
    this.conformacion = ev.target.value;
    this.util.conformacionVar.next(ev.target.value);
    this.setEntidad(this.entidadForm.value);
  }

  setMoneda(ev: any) {
    this.util.monedaChecker.next(ev.target.value);
    this.setEntidad(this.entidadForm.value);
    if (ev.target.value == 1) {
      this.amountSign = "S/."
    } else if (ev.target.value == 2) {
      this.amountSign = "$"
    } else {
      this.amountSign = ""
    }
  }

  displayParamsEntidad() {
    this.entidadForm.controls.nroSolicitudCaja.setValue(this.session.getSession(environment.KEYS.PARAMS).solicitud.nroSolicitudCaja);
    this.entidadForm.controls.codCanal.setValue(this.session.getSession(environment.KEYS.PARAMS).solicitud.codCanal);
    this.entidadForm.controls.codTipoConformacion.setValue(this.util.propChecker(this.session.getSession(environment.KEYS.PARAMS).riesgoDesgravamen.codTipoConformacion, this.conformacionList));
    this.entidadForm.controls.impPrestamo.setValue(this.session.getSession(environment.KEYS.PARAMS).riesgoDesgravamen.impPrestamo);
    this.entidadForm.controls.plazoPrestamo.setValue(this.session.getSession(environment.KEYS.PARAMS).riesgoDesgravamen.plazoPrestamo);
    this.entidadForm.controls.codMonedaPrestamo.setValue(this.util.propChecker(this.session.getSession(environment.KEYS.PARAMS).riesgoDesgravamen.codMonedaPrestamo, this.monedaList));
    this.entidadForm.controls.codigoUsuario.setValue(this.session.getSession(environment.KEYS.PARAMS).cabecera.codigoUsuario);

    this.setMoneda({ target: { value: this.session.getSession(environment.KEYS.PARAMS).riesgoDesgravamen.codMonedaPrestamo } });
    this.util.monedaChecker.next(this.session.getSession(environment.KEYS.PARAMS).riesgoDesgravamen.codMonedaPrestamo);
    this.util.conformacionVar.next(this.session.getSession(environment.KEYS.PARAMS).riesgoDesgravamen.codTipoConformacion);

    this.util.disabledFields(this.entidadForm);
  }

}
