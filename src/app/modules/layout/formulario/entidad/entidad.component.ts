import { Component, OnInit } from '@angular/core';
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

  constructor(private util: UtilService) { }

  ngOnInit() {
    this.init();
  }

  init(){
    this.util.conformacionData.subscribe((data) => {
      this.conformacionList = data;
    })

    this.util.monedaData.subscribe((data) => {
      this.monedaList = data;
    })

    this.conformacion = 1;
    sessionStorage.setItem('codTipoConformacion', this.conformacion);
  }

  setConformacion(ev: any){
    console.log(ev.target.value);
    this.conformacion = ev.target.value;
    this.util.conformacionVar.next(ev.target.value);
    sessionStorage.setItem('codTipoConformacion', this.conformacion);
  }

}
