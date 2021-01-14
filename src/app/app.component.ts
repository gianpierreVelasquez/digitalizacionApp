import { Component, OnInit } from '@angular/core';
import { UtilService } from './core/services/util.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'digitalizacionAppv2';
  spinnerText = "Cargando información...";

  constructor(private util: UtilService) { }

  ngOnInit() {
    this.util.spinnerTextValue.subscribe(resp => {
      this.spinnerText = resp
    })
  }

}
