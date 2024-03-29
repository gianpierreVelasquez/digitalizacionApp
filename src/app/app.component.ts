import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SessionService } from './core/services/session.service';
import { UtilService } from './core/services/util.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'digitalizacionAppv2';
  spinnerText = "Cargando información...";

  parameterId:string;
  codApp:string;

  constructor(private util: UtilService, private router: Router, private route: ActivatedRoute, private session: SessionService) {

    this.cleaner();

    this.router.events.subscribe(routerEvent => {
      if (routerEvent instanceof NavigationStart) {
          if (routerEvent.url == "/") {
              this.router.navigate(["form/solicitud"]);
          }
      }
    });

    this.route.queryParams.subscribe(params => {
      var obj = JSON.parse(JSON.stringify(params));
      this.parameterId = obj['idParam'];
      this.codApp = obj['codApp'];

      if(this.parameterId != undefined && this.parameterId != ''){
        this.session.setSession(environment.KEYS.URL_PARAM, this.parameterId);
      }

      if(this.codApp != undefined && this.codApp != ''){
        this.session.setSession(environment.KEYS.CODE_APP, this.codApp);
      }
      
    });
  }

  ngOnInit() {
    this.util.spinnerTextValue.subscribe(resp => {
      this.spinnerText = resp
    })
  }

  cleaner(){
    this.session.removeSession(environment.KEYS.CODE_APP);
    this.session.removeSession(environment.KEYS.URL_PARAM);
    this.session.removeSession(environment.KEYS.ENTITY);
    this.session.removeSession(environment.KEYS.PARAMS);
    this.session.removeSession(environment.KEYS.PRODUCT);
    this.session.removeSession(environment.KEYS.REQUEST);
    this.session.removeSession(environment.KEYS.TOKEN);
    this.session.removeSession(environment.KEYS.INSURED);
  }

}
