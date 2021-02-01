import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CombosService } from 'src/app/core/services/combos.service';
import { DigitalService } from 'src/app/core/services/digital.service';
import { SPINNER_TEXT, UtilService } from 'src/app/core/services/util.service';
import { PlanData } from 'src/app/shared/models/Response';
import { TabsetComponent } from 'ngx-bootstrap';
import { Desgravamen, Producto } from 'src/app/shared/models/Desgravamen';
import { SessionService } from 'src/app/core/services/session.service';
import { environment } from 'src/environments/environment';
import { ValidatorsService } from 'src/app/core/services/validators.service';
import { LoginService } from 'src/app/core/services/login.service';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss']
})
export class SolicitudComponent implements OnInit {

  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;

  activeTab = 'solicitud';

  solicitudForm: FormGroup;

  solicitudList: any;
  polizaGrupoList: any;
  prestamoList: any;
  monedaList: any;
  amountSign: string = "";

  public showSeguro: boolean = false;

  public cabezera: string = "¿Desea contratar un seguro de vida?";
  public seguro: string = "N";
  public showPlanes: boolean = false;
  public showRadio: boolean = true;

  public planData: PlanData = null;
  public selectedPlan: number = -1;

  public entidadFormObserverHelper: boolean = false

  //Operadores
  planSeguroList: any;

  validations = {
    'tipSolicitud': [
      { type: 'required', message: 'El tipo de solicitud es requerido.' },
    ],
    'codTipoPrestamo': [
      { type: 'required', message: 'El tipo de prestamo es requerido.' },
    ],
    'numPolizaGrupo': [
      { type: 'required', message: 'El tipo de poliza grupo es requerido.' },
    ],
    'codMonedaCumulo': [
      { type: 'required', message: 'El tipo de moneda de cúmulo es requerido.' },
    ],
    'impCumulo': [
      { type: 'required', message: 'El importe cúmulo es requerido.' },
      { type: 'notzero', message: 'El importe ingresado debe ser mayor a 0.' },
      { type: 'pattern', message: 'El campo solo admite un total de 2 decimales.' }
    ],
    'comentarios': [
      { type: 'required', message: 'El comentario es requerido.' },
      { type: 'whitespace', message: 'Este campo no puede recibir caracteres vacíos.' }
    ]
  };

  constructor(private formBuilder: FormBuilder, private validator: ValidatorsService, private util: UtilService, private session: SessionService,
    private combosServ: CombosService, private digitalServ: DigitalService, private loginServ: LoginService, private _authServ: AuthenticationService) {
    this.solicitudForm = this.formBuilder.group({
      tipSolicitud: ['', [Validators.required]],
      codTipoPrestamo: ['', [Validators.required]],
      numPolizaGrupo: ['', [Validators.required]],
      codMonedaCumulo: ['', [Validators.required]],
      impCumulo: ['', [Validators.required, Validators.pattern("^[0-9]{1,12}(\\.\\d{1,2})?$"), this.validator.notZero]],
      comentarios: [''],
    });
  }

  async ngOnInit() {
    this.util.callServices.subscribe(resp => {
      if (resp == true && this.session.getSession(environment.KEYS.URL_PARAM) != null) {
        this.init();
      } else {
        this.util.hideSpinner();
      }
    });

    this.util.monedaChecker.subscribe(resp => {
      this.solicitudForm.controls.codMonedaCumulo.setValue(resp);
      this.setCoinType({ target: { value: resp } });
      this.util.disabledFields(this.solicitudForm);
    })

    this.util.entidadFormObserver.subscribe(resp => {
      this.entidadFormObserverHelper = resp;
    })

  }

  init() {
    this.util.showSpinner();
    Promise.all([
      this.obtenerTipoSolicitud(),
      this.obtenerTipoPrestamo(),
      this.obtenerTipoPoliza(),
      this.obtenerTipoMoneda()
    ]).then((value) => {
      this.util.hideSpinner();
    }).catch(reason => {
      console.log(reason)
      this.util.hideSpinner();
    });
  }

  async obtenerTipoMoneda() {
    return this.combosServ.obtenerTipoMoneda()
      .then(resp => {
        var data = resp.data;
        this.monedaList = data;
      }).catch(err => {
        console.log(err);
      })
  }

  async obtenerTipoPrestamo() {
    return this.combosServ.obtenerTipoPrestamo()
      .then(resp => {
        var data = resp.data;
        this.prestamoList = data;
      }).catch(err => {
        console.log(err);
      })
  }

  async obtenerTipoSolicitud() {
    return this.digitalServ.obtenerTipoSolicitud()
      .then(resp => {
        var data = resp.data;
        this.solicitudList = data;
      }).catch(err => {
        console.log(err);
      })
  }

  async obtenerTipoPoliza() {
    return this.digitalServ.obtenerTipoPoliza()
      .then(resp => {
        var data = resp.data;
        this.polizaGrupoList = data;
      }).catch(err => {
        console.log(err);
      })
  }

  verifyToken() {
    this._authServ.checkTokenValidation();
    this.util.tokenNeedsUpdate.subscribe(async (resp) => {
      if (resp == true) {
        this.loginServ.getCredencials()
          .then(() => {
            this.obtenerPlanSeguroVida();
          })
          .catch(err => {
            console.error(err)
          })
      } else {
        this.obtenerPlanSeguroVida();
      }
    })
  }

  async obtenerPlanSeguroVida() {
    this.util.showSpinner();
    this.util.setSpinnerTextValue(SPINNER_TEXT.PLANS);
    return this.digitalServ.obtenerPlanSeguroVida()
      .then(resp => {
        var data = resp.data;
        this.planSeguroList = data;
        this.util.hideSpinner();
      }).catch(err => {
        console.log(err);
        this.util.hideSpinner();
      })
  }

  async setPolizaGrupo(ev: any) {
    if (ev.target.value == '6110810100262') {
      this.showSeguro = true;
      this.verifyToken();
    } else {
      this.showSeguro = false;
      this.showPlanes = false;
      this.seguro = 'N';
      this.selectedPlan = -1;
      this.planData = {};
    }
  }

  checkSeguro(ev: any) {
    if (ev.target.value == 'S') {
      this.showPlanes = true;
      this.util.isPlanActivated.next(true);
    } else {
      this.showPlanes = false;
      this.util.isPlanActivated.next(false);
    }
  }

  setPlan(i: number, plan?: any) {
    this.selectedPlan = i;
    this.planData = plan;
  }

  confirmPlan() {
    this.showRadio = false;
    this.showPlanes = false;
    this.cabezera = "Plan Seleccionado: " + this.planData.text;

    var producto: Producto = {
      codCia: 1,
      codRamo: 611,
      numPolizaGrupo: parseInt(this.solicitudForm.controls.numPolizaGrupo.value),
      codPlan: parseInt(this.planData.id)
    }

    this.session.setSession(environment.KEYS.PRODUCT, producto);
  }

  removePlan() {
    this.selectedPlan = -1;
    this.showRadio = true;
    this.showPlanes = true;
    this.cabezera = "¿Desea contratar un seguro de vida?"
  }

  hidePlan() {
    this.seguro = 'N';
    this.selectedPlan = -1;
    this.showPlanes = false;
  }

  verifyDPS() {

    if (this.util.dpsObserver.getValue() === false) {
      var fecNac: string;

      var asegurados: any[] = this.session.getSession(environment.KEYS.PARAMS).asegurados;
      asegurados.forEach(x => {
        if (x.codParentesco === 1) {
          return fecNac = x.fecNacimiento;
        } else {
          return fecNac = undefined
        }
      })

      var impCum = this.solicitudForm.controls.impCumulo.value;

      if (fecNac != undefined && impCum != undefined) {
        var data = {
          'Fecha_Nacimiento': fecNac,
          'Importe_Cumulo': impCum
        }

        this._authServ.checkTokenValidation();
        this.util.tokenNeedsUpdate.subscribe(async (resp) => {
          if (resp == true) {
            this.util.showSpinner()
            this.loginServ.getCredencials()
              .then(() => {
                this.digitalServ.requiereDPS(this.solicitudForm.controls.numPolizaGrupo.value, data)
                  .then(resp => {
                    this.util.dpsObserver.next(true);
                    var data = resp.Resultado;
                    if (data === 'N') {
                      this.util.dpsChecker.next(false);
                    }
                    else {
                      this.util.dpsChecker.next(true);
                    }
                    this.util.hideSpinner();
                  }).catch(err => {
                    console.error(err);
                    this.util.hideSpinner();
                  })
              })
              .catch(err => {
                console.error(err);
              })
          } else {
            this.util.showSpinner();
            this.digitalServ.requiereDPS(this.solicitudForm.controls.numPolizaGrupo.value, data)
              .then(resp => {
                this.util.dpsObserver.next(true);
                var data = resp.Resultado;
                if (data === 'N') {
                  this.util.dpsChecker.next(false);
                }
                else {
                  this.util.dpsChecker.next(true);
                }
                this.util.hideSpinner();
              }).catch(err => {
                console.error(err);
                this.util.hideSpinner();
              })
          }
        });
      } else {
        this.util.dpsObserver.next(false);
      }
    }
  }

  setSolicitud(values) {
    if (this.solicitudForm.invalid) {
      this.solicitudForm.markAllAsTouched();
    } else {
      if (this.util.entidadFormObserver.getValue() == true) {
        if (this.showPlanes == true) {
          this.util.warningAlert('Advertencia', 'Debe seleccionar un plan antes de continuar.')
        } else {
          this.session.setSession(environment.KEYS.REQUEST, values);
          if (this.util.dpsObserver.getValue() === false) {
            this.verifyDPS();
          }
          this.selectTab(1);
        }
      } else {
        this.util.entidadFormChecker.next(true)
      }
    }
  }

  setCoinType(ev: any) {
    if (ev.target.value == 1) {
      this.amountSign = "S/."
    } else if (ev.target.value == 2) {
      this.amountSign = "$"
    } else {
      this.amountSign = ""
    }
  }

  selectTab(tabId: number) {
    this.staticTabs.tabs[tabId].active = true;
  }

  desgravamenFormat() {
    var desgravamen: Desgravamen = {
      cabecera: this.session.getSession(environment.KEYS.PARAMS).cabecera,
      solicitud: {
        codCanal: this.session.getSession(environment.KEYS.ENTITY).codCanal,
        nroSolicitudCaja: parseInt(this.session.getSession(environment.KEYS.ENTITY).solicitud.nroSolicitudCaja),
        tipSolicitud: this.solicitudForm.controls.tipSolicitud.value,
        fecSolicitud: this.session.getSession(environment.KEYS.PARAMS).solicitud.fecSolicitud,
        comentarios: this.solicitudForm.controls.comentarios.value,
      },
      producto: this.session.getSession(environment.KEYS.PRODUCT),
      riesgoDesgravamen: {
        codTipoConformacion: this.session.getSession(environment.KEYS.ENTITY).codTipoConformacion,
        codTipoPrestamo: this.solicitudForm.controls.codTipoPrestamo.value,
        codMonedaPrestamo: this.solicitudForm.controls.codMonedaPrestamo.value,
        impPrestamo: this.session.getSession(environment.KEYS.ENTITY).impPrestamo,
        numPrestamo: 0,
        codMonedaCumulo: this.solicitudForm.controls.codMonedaCumulo.value,
        impCumulo: this.solicitudForm.controls.impCumulo.value,
        plazoPrestamo: this.session.getSession(environment.KEYS.ENTITY).plazoPrestamo
      }
    }
    
    this.util.desgravamenData.next(desgravamen);
  }

}
