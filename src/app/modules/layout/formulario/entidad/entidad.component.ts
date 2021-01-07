import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CombosService } from 'src/app/core/services/combos.service';
import { DigitalService } from 'src/app/core/services/digital.service';
import { SessionService } from 'src/app/core/services/session.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ValidatorsService } from 'src/app/core/services/validators.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-entidad',
  templateUrl: './entidad.component.html',
  styleUrls: ['./entidad.component.scss']
})
export class EntidadComponent implements OnInit {

  entidadForm: FormGroup;
  submitted: boolean = false;

  //Operadores
  conformacion: any;
  moneda: string = "";
  amountSign: string = "";

  //Listas
  conformacionList: any;
  monedaList: any;

  validations = {
    'nroSolicitudCaja': [
      { type: 'required', message: 'El nro de solicitud es requerido.' },
    ],
    'codTipoConformacion': [
      { type: 'required', message: 'El tipo de conformación es requerido.' },
    ],
    'codMonedaPrestamo': [
      { type: 'required', message: 'El tipo de moneda prestamo es requerido.' },
    ],
    'plazoPrestamo': [
      { type: 'required', message: 'El plazo de prestamo es requerido.' },
      { type: 'notzero', message: 'El plazo debe ser mayor a 0.' },
    ],
    'impPrestamo': [
      { type: 'required', message: 'El importe del prestamo es requerido.' },
    ],
    'codigoUsuario': [
      { type: 'required', message: 'El funcionario del canal es requerido.' },
    ]
  };

  constructor(private session: SessionService, private util: UtilService, private combosServ: CombosService, private digitalServ: DigitalService, private fb: FormBuilder, private validator: ValidatorsService) {
    this.entidadForm = this.fb.group({
      nroSolicitudCaja: ['', [Validators.required]],
      codTipoConformacion: ['', [Validators.required]],
      codMonedaPrestamo: ['', [Validators.required]],
      plazoPrestamo: ['', [Validators.required, this.validator.notZero]],
      impPrestamo: ['', [Validators.required]],
      codCanal: [''],
      codigoUsuario: ['', [Validators.required]]
    })
  }

  ngOnInit() {
    this.init();

    this.util.entidadFormChecker.subscribe(resp => {
      this.setEntidad(this.entidadForm.value)
    })
  }

  async init(){

    this.util.showSpinner();
    Promise.all([
      this.obtenerTipoConformación(),
      this.obtenerTipoMoneda(),
      this.obtenerParametros()
    ]).then((value) => {
      this.util.hideSpinner();
    }).catch(reason => {
      console.log(reason)
      this.util.hideSpinner();
    });

  }

  async obtenerParametros(){
    this.digitalServ.obtenerParametros('2f73b18b-6bbd-4ccd-bf8b-c5baef073f80')
    .then(resp => {
      var data = resp;
      this.util.desgravamenData.next(data);
      this.session.setSession(environment.KEYS.PARAMS, data);
      this.displayParamsEntidad();
    }).catch(err => {
      console.log(err);
    })
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

  setEntidad(values){
    if (this.entidadForm.invalid) {
      this.entidadForm.markAllAsTouched();
    } else {
      this.submitted = this.submitted == true ? false : true;
      this.util.entidadFormObserver.next(true)
      console.log(values)
    }
  }

  setConformacion(ev: any){
    this.conformacion = ev.target.value;
    this.util.conformacionVar.next(ev.target.value);
    sessionStorage.setItem('codTipoConformacion', this.conformacion);
  }

  setMoneda(ev: any){
    this.util.monedaChecker.next(ev.target.value);
    if (ev.target.value == 1) {
      this.amountSign = "S/."
    } else if(ev.target.value == 2) {
      this.amountSign = "$"
    } else {
      this.amountSign = ""
    }
  }

  displayParamsEntidad(){
    this.entidadForm.controls.nroSolicitudCaja.setValue(this.session.getSession(environment.KEYS.PARAMS).solicitud.nroSolicitudCaja);
    this.entidadForm.controls.codCanal.setValue(this.session.getSession(environment.KEYS.PARAMS).solicitud.codCanal);
    this.entidadForm.controls.codTipoConformacion.setValue(this.session.getSession(environment.KEYS.PARAMS).riesgoDesgravamen.codTipoConformacion);
    this.entidadForm.controls.impPrestamo.setValue(this.session.getSession(environment.KEYS.PARAMS).riesgoDesgravamen.impPrestamo);
    this.entidadForm.controls.plazoPrestamo.setValue(this.session.getSession(environment.KEYS.PARAMS).riesgoDesgravamen.plazoPrestamo);
    this.entidadForm.controls.codMonedaPrestamo.setValue(this.session.getSession(environment.KEYS.PARAMS).riesgoDesgravamen.codMonedaPrestamo);
    this.entidadForm.controls.codigoUsuario.setValue(this.session.getSession(environment.KEYS.PARAMS).cabecera.codigoUsuario);

    this.setMoneda({target:{value:this.session.getSession(environment.KEYS.PARAMS).riesgoDesgravamen.codMonedaPrestamo}});
    this.util.monedaChecker.next(this.session.getSession(environment.KEYS.PARAMS).riesgoDesgravamen.codMonedaPrestamo);
    this.util.conformacionVar.next(this.session.getSession(environment.KEYS.PARAMS).riesgoDesgravamen.codTipoConformacion);
  }

}
