import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DigitalService } from 'src/app/core/services/digital.service';

@Component({
  selector: 'app-asegurado',
  templateUrl: './asegurado.component.html',
  styleUrls: ['./asegurado.component.scss']
})
export class AseguradoComponent implements OnInit {

  showExtra: boolean = false;
  cuestionarioList: any = [];

  constructor(private location: Location, private router: Router, private digitalServ: DigitalService) { }

  ngOnInit() {
    this.obtenerDigital();
  }

  obtenerDigital(){
    Promise.all(
      [
        this.recuperarCuestionario(),
        this.requiereDps()
      ]
    ).then(values => {
      console.log(values);
    }).catch(err => {
      console.log(err);
    })
  }

  recuperarCuestionario(){
    return this.digitalServ.recuperarCuestionario().toPromise().then(resp => {
      console.log(resp);
      this.cuestionarioList = resp['Resultado'];
      console.log(this.cuestionarioList);
      
    })
  }

  requiereDps(){
    return this.digitalServ.requiereDps().toPromise().then(resp => {
      console.log(resp);
    })
  }

}
