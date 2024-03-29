
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { ERROR_MESSAGES } from 'src/app/core/enum/errors.enum';
import { CombosService } from 'src/app/core/services/combos.service';
import { DigitalService } from 'src/app/core/services/digital.service';
import { LoginService } from 'src/app/core/services/login.service';
import { SessionService } from 'src/app/core/services/session.service';
import { SPINNER_TEXT, UtilService } from 'src/app/core/services/util.service';
import { ValidatorsService } from 'src/app/core/services/validators.service';
import { environment } from 'src/environments/environment';

import * as Djson from '../../../../../assets/digitalizacionAppConfig.json';

@Component({
  selector: 'app-entidad',
  templateUrl: './entidad.component.html',
  styleUrls: ['./entidad.component.scss']
})
export class EntidadComponent implements OnInit {

  private configVar: any = (Djson as any).default;
  
  
  entidadForm: FormGroup;

  //Operadores
  conformacion: any;
  moneda: string = '';
  amountSign: string = '';

  //Listas
  conformacionList: any;
  monedaList: any;

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
    private loginServ: LoginService, private auth: AuthenticationService) {
    this.entidadForm = this.fb.group({
      nroSolicitudCaja: ['', [Validators.required]],
      codTipoConformacion: ['', [Validators.required, this.validator.notNull]],
      codMonedaPrestamo: ['', [Validators.required, this.validator.notNull]],
      plazoPrestamo: ['', [Validators.required, Validators.pattern("^[0-9]+$"), this.validator.notZero]],
      impPrestamo: ['', [Validators.required]],
      codCanal: [''],
      codigoUsuario: ['', [Validators.required]]
    }, { updateOn: 'blur' });
  }

  ngOnInit() {
    var configVars = this.configVar[0];

    this.getToken();

    setInterval(() => {
      this.getTokenAuth()
    }, configVars.token_timer_min * 60 * 1000);

    this.util.entidadFormChecker.subscribe(resp => {
      this.setEntidad(this.entidadForm.value)
    })

    this.util.callServices.subscribe(resp => {
      // this.obtenerParametros()
      if (resp == true && this.session.getSession(environment.KEYS.URL_PARAM) != null) {
        this.init();
      } else {
        this.util.hideSpinner();
      }
    });

    this.entidadForm.statusChanges.subscribe(val => {
      if (val == 'VALID') {
        this.util.disabledFields(this.entidadForm);
        this.setEntidad(this.entidadForm.value)
      }
    })

    // Para convertir a base 64
    // console.log(this.auth.encrypt('apicjpiurapre'));
    // console.log(this.auth.encrypt('Lima2019$'));
    
  }

  getToken() {
    this.util.showSpinner();
    this.loginServ.getCredencials()
      .then(resp => {
        this.session.setSession(environment.KEYS.TOKEN, resp);
        if (this.session.getSession(environment.KEYS.URL_PARAM) == null) {
          this.util.notAllowAlert('Advertencia', ERROR_MESSAGES.MISS_ID_PARAMETER);
        } else {
          this.util.callServices.next(true);
        }
      }).catch(err => {
        this.util.hideSpinner();
        console.error(err);
        this.util.callServices.next(false)
      })
  }

  getTokenAuth() {
    this.loginServ.getCredencials()
      .then(resp => {
        this.session.setSession(environment.KEYS.TOKEN, resp);
      }).catch(err => {
        console.error(err);
      })
  }

  async init() {
    this.util.showSpinner();
    Promise.all([
      this.obtenerTipoConformación(),
      this.obtenerTipoMoneda(),
    ]).then((value) => {
      this.obtenerParametros()
    }).catch(err => {
      console.error(err)
    });
  }

  async obtenerParametros() {
    this.util.showSpinner()
    this.util.setSpinnerTextValue(SPINNER_TEXT.PARAMETERS);
    this.digitalServ.obtenerParametros(this.session.getSession(environment.KEYS.URL_PARAM))
      .then(resp => {
        var data = resp;
        this.session.setSession(environment.KEYS.PARAMS, data);
        this.displayParamsEntidad();
        this.util.hideSpinner();
        // this.util.callServices.next(true);
      }).catch(err => {
        console.error(err);
        this.util.hideSpinner();
        this.util.callServices.next(false);
      })
  }

  async obtenerTipoConformación() {
    await this.combosServ.obtenerTipoConformación()
      .then(resp => {
        var data = resp.data;
        this.conformacionList = data;
      }).catch(err => {
        console.error(err);
      })
  }

  async obtenerTipoMoneda() {
    await this.combosServ.obtenerTipoMoneda()
      .then(resp => {
        var data = resp.data;
        this.monedaList = data;
      }).catch(err => {
        console.error(err);
      })
  }

  setEntidad(values) {
    if (this.entidadForm.invalid) {
      this.entidadForm.markAllAsTouched();
      this.util.entidadFormObserver.next(false)
    } else {
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
