import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CombosService } from 'src/app/core/services/combos.service';
import { UtilService } from 'src/app/core/services/util.service';
import { PlanData } from 'src/app/shared/models/Response';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss']
})
export class SolicitudComponent implements OnInit {

  solicitudForm: FormGroup;

  solicitudList: any;
  polizaGrupoList: any;
  prestamoList: any;
  monedaList: any;
  amountSign: string = "S/.";

  public showSeguro: boolean = false;

  public cabezera: string = "¿Desea contratar un seguro de vida?";
  public seguro: string = "N";
  public showPlanes: boolean = false;
  public showRadio: boolean = true;

  public planData: PlanData;
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

  constructor(private formBuilder: FormBuilder, private router: Router, private util: UtilService, private combosServ: CombosService) {
    this.solicitudForm = this.formBuilder.group({
      tipSolicitud: ['', [Validators.required]],
      codTipoPrestamo: ['', [Validators.required]],
      numPolizaGrupo: ['', [Validators.required]],
      codMonedaPrestamo: ['', [Validators.required]],
      impCumulo: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.util.solicitudData.subscribe((data) => {
      this.solicitudList = data;
    })

    this.util.polizaGrupoData.subscribe((data) => {
      this.polizaGrupoList = data;
    })

    this.util.prestamoData.subscribe((data) => {
      this.prestamoList = data;
    })

    this.util.monedaData.subscribe((data) => {
      this.monedaList = data;
    })

    this.util.planSeguroData.subscribe((resp) => {
      this.planSeguroList = resp;
    })
  }

  setPolizaGrupo(ev: any) {
    console.log(ev.target.value);
    if (ev.target.value == '6110810100262') {
      this.showSeguro = true;
    } else {
      this.showSeguro = false;
    }
  }

  checkSeguro(ev: any) {
    if (ev.target.value == 'S') {
      this.showPlanes = true;
    } else {
      this.showPlanes = false;
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

  solicitud(values) {
    if (this.solicitudForm.invalid) {
      this.solicitudForm.markAllAsTouched();
    } else {
      this.router.navigate(['form/asegurado']);
    }
  }

}
