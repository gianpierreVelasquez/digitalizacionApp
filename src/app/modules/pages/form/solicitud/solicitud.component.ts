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
import * as Djson from '../../../../../assets/digitalizacionAppConfig.json';

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

  public planData: PlanData = {};
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
      { type: 'notzero', message: 'El importe ingresado debe ser mayor a 0.' }
    ],
    'comentarios': [
      { type: 'required', message: 'El comentario es requerido.' },
      { type: 'whitespace', message: 'Este campo no puede recibir caracteres vacíos.' }
    ]
  };

  private configVar: any = (Djson as any).default;

  constructor(private formBuilder: FormBuilder, private validator: ValidatorsService, private util: UtilService, private session: SessionService,
    private combosServ: CombosService, private digitalServ: DigitalService, private loginServ: LoginService, private _authServ: AuthenticationService) {
    this.solicitudForm = this.formBuilder.group({
      tipSolicitud: ['', [Validators.required]],
      codTipoPrestamo: ['', [Validators.required]],
      numPolizaGrupo: ['', [Validators.required]],
      codMonedaCumulo: ['', [Validators.required]],
      impCumulo: ['', [Validators.required, this.validator.notZero]],
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
      console.error(reason)
      this.util.hideSpinner();
    });
  }

  async obtenerTipoMoneda() {
    return this.combosServ.obtenerTipoMoneda()
      .then(resp => {
        var data = resp.data;
        this.monedaList = data;
      }).catch(err => {
        console.error(err);
      })
  }

  async obtenerTipoPrestamo() {
    return this.combosServ.obtenerTipoPrestamo()
      .then(resp => {
        var data = resp.data;
        this.prestamoList = data;
      }).catch(err => {
        console.error(err);
      })
  }

  async obtenerTipoSolicitud() {
    return this.digitalServ.obtenerTipoSolicitud()
      .then(resp => {
        var data = resp.data;
        this.solicitudList = data;
      }).catch(err => {
        console.error(err);
      })
  }

  async obtenerTipoPoliza() {
    return this.digitalServ.obtenerTipoPoliza()
      .then(resp => {
        var data = resp.data;
        this.polizaGrupoList = data;
      }).catch(err => {
        console.error(err);
      })
  }

  // verifyToken() {
  //   this._authServ.checkTokenValidation();
  //   this.util.tokenNeedsUpdate.subscribe(async (resp) => {
  //     if (resp == true) {
  //       this.loginServ.getCredencials()
  //         .then(() => {
  //           this.obtenerPlanSeguroVida();
  //         })
  //         .catch(err => {
  //           console.error(err)
  //         })
  //     } else {
  //       this.obtenerPlanSeguroVida();
  //     }
  //   })
  // }

  async obtenerPlanSeguroVida() {
    this.util.showSpinner();
    this.util.setSpinnerTextValue(SPINNER_TEXT.PLANS);
    return this.digitalServ.obtenerPlanSeguroVida()
      .then(resp => {
        var data = resp.data;
        this.planSeguroList = data;
        this.util.hideSpinner();
      }).catch(err => {
        console.error(err);
        this.util.hideSpinner();
      })
  }

  async setPolizaGrupo(ev: any) {
    if (ev.target.value == '6110810100262') {
      this.showSeguro = true;
      this.obtenerPlanSeguroVida();
    } else {
      this.planSeguroList = []
      this.showSeguro = false;
      this.showPlanes = false;
      this.seguro = 'N';
      this.selectedPlan = -1;
      this.planData = {};
      this.cabezera = "¿Desea contratar un seguro de vida?"
      this.showRadio = true;
      this.setProducto()
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

    this.setProducto()
  }

  setProducto() {
    var configVars = this.configVar[0];

    var producto: Producto = {
      codCia: configVars.cod_cia,
      codRamo: configVars.cod_ramo,
      numPolizaGrupo: parseInt(this.solicitudForm.controls.numPolizaGrupo.value), 
      codPlan: parseInt(this.planData.id) || 0
    }

    console.log(producto);
    

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


  setSolicitud(values) {
    if (this.solicitudForm.invalid) {
      this.solicitudForm.markAllAsTouched();
    } else {
      this.setProducto();
      this.desgravamenFormat();
      if (this.session.getSession(environment.KEYS.PARAMS) !== null) {
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
      } else {
        this.util.notAllowAlert('Error', 'No puede continuar con el formulario, ya que no cuenta con los parametros requeridos.')
      }
    }
  }

  verifyDPS() {
    if (this.util.dpsObserver.getValue() === false) {

      var asegurados: any[] = this.session.getSession(environment.KEYS.PARAMS).asegurados;
      var aseguradoP = asegurados.find(x => x.codParentesco === 1);

      var fecNac = aseguradoP.fecNacimiento;
      var impCum = this.solicitudForm.controls.impCumulo.value;

      if (fecNac != undefined && impCum != undefined) {
        var data = {
          'Fecha_Nacimiento': fecNac,
          'Importe_Cumulo': impCum
        }

        this.util.showSpinner();
        this.util.setSpinnerTextValue(SPINNER_TEXT.CHECK_DPS)
        this.digitalServ.requiereDPS(this.solicitudForm.controls.numPolizaGrupo.value, data)
          .then(resp => {
            this.util.dpsObserver.next(true);
            var data = resp.Resultado;
            if (data === 'N') {
              this.util.dpsChecker.next(false);
              this.util.cuestionarioIsSubmitted.next(true);
            }
            else {
              this.util.dpsChecker.next(true);
            }
            this.util.hideSpinner();
          }).catch(err => {
            console.error(err);
            this.util.hideSpinner();
          })
      } else {
        this.util.dpsObserver.next(false);
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

    var solicitud = this.solicitudForm.getRawValue();

    var desgravamen: Desgravamen = {
      cabecera: this.session.getSession(environment.KEYS.PARAMS).cabecera,
      solicitud: {
        codCanal: this.session.getSession(environment.KEYS.ENTITY).codCanal,
        nroSolicitudCaja: parseInt(this.session.getSession(environment.KEYS.ENTITY).nroSolicitudCaja),
        tipSolicitud: parseInt(solicitud.tipSolicitud),
        fecSolicitud: this.session.getSession(environment.KEYS.PARAMS).solicitud.fecSolicitud,
        comentarios: solicitud.comentarios,
      },
      producto: this.session.getSession(environment.KEYS.PRODUCT),
      riesgoDesgravamen: {
        codTipoConformacion: this.session.getSession(environment.KEYS.ENTITY).codTipoConformacion,
        codTipoPrestamo: parseInt(solicitud.codTipoPrestamo),
        codMonedaPrestamo: parseInt(this.session.getSession(environment.KEYS.ENTITY).codMonedaPrestamo),
        impPrestamo: this.session.getSession(environment.KEYS.ENTITY).impPrestamo,
        numPrestamo: 0,
        codMonedaCumulo: solicitud.codMonedaCumulo,
        impCumulo: solicitud.impCumulo,
        plazoPrestamo: this.session.getSession(environment.KEYS.ENTITY).plazoPrestamo
      }
    }

    this.util.desgravamenData.next(desgravamen);
  }

}
