import { Component, OnInit } from '@angular/core';
import { CombosService } from './core/services/combos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'digitalizacionAppv2';

  constructor(private combosServ: CombosService) {}

  ngOnInit() {
    this.obtenerTipoMoneda();
  }

  obtenerTipoMoneda(){
    this.combosServ.obtenerTipoMoneda().toPromise().then(resp => {
      console.log(resp);
    })
  }

}
