import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CombosService } from 'src/app/core/services/combos.service';
import { DigitalService } from 'src/app/core/services/digital.service';
import { UtilService } from 'src/app/core/services/util.service';
import { PlanData } from 'src/app/shared/models/Response';
import { TabsetComponent } from 'ngx-bootstrap';
import { Producto } from 'src/app/shared/models/Desgravamen';
import { SessionService } from 'src/app/core/services/session.service';
import { environment } from 'src/environments/environment';

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
    'codMonedaPrestamo': [
      { type: 'required', message: 'El tipo de moneda de cúmulo es requerido.' },
    ],
    'impCumulo': [
      { type: 'required', message: 'El importe cúmulo es requerido.' },
    ]
  };

  constructor(private formBuilder: FormBuilder, private router: Router, private util: UtilService, private session: SessionService, 
    private combosServ: CombosService, private digitalServ: DigitalService) {
    this.solicitudForm = this.formBuilder.group({
      tipSolicitud: ['', [Validators.required]],
      codTipoPrestamo: ['', [Validators.required]],
      numPolizaGrupo: ['', [Validators.required]],
      codMonedaPrestamo: ['', [Validators.required]],
      impCumulo: ['', [Validators.required]],
    });
  }

  async ngOnInit() {
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

    this.util.monedaChecker.subscribe(resp => {
      this.solicitudForm.controls.codMonedaPrestamo.setValue(resp);
      this.setCoinType({target:{value: resp}})
    })

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

  async obtenerPlanSeguroVida() {
    return this.digitalServ.obtenerPlanSeguroVida()
    .then(resp => {
      var data = resp.data;
      this.planSeguroList = data;
    }).catch(err => {
      console.log(err);
    })
  }

  async setPolizaGrupo(ev: any) {
    if (ev.target.value == '6110810100262') {
      this.showSeguro = true;
      await this.obtenerPlanSeguroVida()
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
      codPlan:  parseInt(this.planData.id),
      numPolizaGrupo: parseInt(this.solicitudForm.controls.numPolizaGrupo.value)
    }
    console.log(producto);
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
      if (this.util.entidadFormObserver.getValue() === true) {
        if(this.showPlanes == true){
          this.util.warningAlert('Advertencia', 'Debe seleccionar un plan antes de continuar.')
        } else {
          console.log(values);
          this.selectTab(1);
        }   
      } else {
        this.util.warningAlert('Advertencia', 'Quedan campos por completar');
        this.util.entidadFormChecker.next(true)
      }
    }
  }

  setCoinType(ev: any){
    if (ev.target.value == 1) {
      this.amountSign = "S/."
    } else if(ev.target.value == 2) {
      this.amountSign = "$"
    } else {
      this.amountSign = ""
    }
  }

  selectTab(tabId: number) {
    this.staticTabs.tabs[tabId].active = true;
  }

}
