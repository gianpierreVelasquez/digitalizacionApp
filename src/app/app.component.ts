import { Component, OnInit } from '@angular/core';
import { CombosService } from './core/services/combos.service';
import { UtilService } from './core/services/util.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'digitalizacionAppv2';
  spinnerText = "Cargando información...";

  constructor(private combosServ: CombosService, private util: UtilService) { }

  ngOnInit() {
    this.obtenerCombos();
  }

  obtenerCombos() {
    this.util.showSpinner();
    Promise.all([
      this.obtenerTipoMoneda(),
      this.obtenerTipoConformación(),
      this.obtenerTipoPrestamo(),
      this.obtenerTipoSolicitud(),
      this.obtenerTipoPoliza(),
      this.obtenerPlanSeguroVida(),
      this.obtenerTipoDocumento(),
      this.obtenerTipoParentesco()
    ]).then((value) => {
      console.log(value);
      this.util.hideSpinner();
    }).catch(reason => {
      console.log(reason)
      this.util.hideSpinner();
    });
  }

  obtenerTipoMoneda() {
    return this.combosServ.obtenerTipoMoneda().toPromise().then(resp => {
      var data = resp.data;
      this.util.monedaData.next(data);
    },
      err => {
        console.log(err);
      }
    )
  }

  obtenerTipoPrestamo() {
    return this.combosServ.obtenerTipoPrestamo().toPromise().then(resp => {
      var data = resp.data;
      this.util.prestamoData.next(data);
    },
      err => {
        console.log(err);
      }
    )
  }

  obtenerTipoConformación() {
    return this.combosServ.obtenerTipoConformación().toPromise().then(resp => {
      var data = resp.data;
      this.util.conformacionData.next(data);
    },
      err => {
        console.log(err);
      }
    )
  }

  obtenerTipoSolicitud() {
    return this.combosServ.obtenerTipoSolicitud().toPromise().then(resp => {
      var data = resp.data;
      this.util.solicitudData.next(data);
    },
      err => {
        console.log(err);
      }
    )
  }

  obtenerTipoPoliza() {
    return this.combosServ.obtenerTipoPoliza().toPromise().then(resp => {
      var data = resp.data;
      this.util.polizaGrupoData.next(data);
    },
      err => {
        console.log(err);
      }
    )
  }

  obtenerPlanSeguroVida() {
    return this.combosServ.obtenerPlanSeguroVida().toPromise().then(resp => {
      var data = resp.data;
      this.util.planSeguroData.next(data);
    },
      err => {
        console.log(err);
      }
    )
  }

  obtenerTipoDocumento() {
    return this.combosServ.obtenerTipoDocumento().toPromise().then(resp => {
      var data = resp.data;
      this.util.tipoDocData.next(data);
    },
      err => {
        console.log(err);
      }
    )
  }

  obtenerTipoParentesco() {
    return this.combosServ.obtenerTipoParentesco().toPromise().then(resp => {
      var data = resp.data;
      this.util.parentescoData.next(data);
    },
      err => {
        console.log(err);
      }
    )
  }
}
