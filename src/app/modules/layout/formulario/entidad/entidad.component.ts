import { Component, OnInit } from '@angular/core';
import { CombosService } from 'src/app/core/services/combos.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-entidad',
  templateUrl: './entidad.component.html',
  styleUrls: ['./entidad.component.scss']
})
export class EntidadComponent implements OnInit {

  //Operadores
  conformacion: any;
  moneda: string = "";

  //Listas
  conformacionList: any;
  monedaList: any;

  constructor(private util: UtilService, private combosServ: CombosService) { }

  ngOnInit() {
    this.init();
  }

  async init(){

    this.util.showSpinner();
    Promise.all([
      this.obtenerTipoConformación(),
      this.obtenerTipoMoneda()
    ]).then((value) => {
      console.log(value);
      this.util.hideSpinner();
    }).catch(reason => {
      console.log(reason)
      this.util.hideSpinner();
    });

    this.conformacion = 1;
    sessionStorage.setItem('codTipoConformacion', this.conformacion);
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

  setConformacion(ev: any){
    console.log(ev.target.value);
    this.conformacion = ev.target.value;
    this.util.conformacionVar.next(ev.target.value);
    sessionStorage.setItem('codTipoConformacion', this.conformacion);
  }

  setMoneda(ev: any){
    this.util.monedaChecker.next(ev.target.value);
  }

}
