import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormularioComponent } from './modules/layout/formulario/formulario.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MantenimientoComponent } from './modules/layout/mantenimiento/mantenimiento.component';
import { NavBarComponent } from './modules/layout/formulario/nav-bar/nav-bar.component';
import { EntidadComponent } from './modules/layout/formulario/entidad/entidad.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from './shared/shared.module';

import { httpInterceptorProvider } from './core/interceptors';

import { NgbButtonsModule, NgbDropdownModule, NgbTabsetModule, NgbTooltipModule, NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    FormularioComponent,
    NavBarComponent,
    EntidadComponent,
    MantenimientoComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    SharedModule,
    AngularFontAwesomeModule,
    NgxSpinnerModule,
    HttpClientModule,
    NgbTabsetModule
  ],
  providers: [
    httpInterceptorProvider,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
