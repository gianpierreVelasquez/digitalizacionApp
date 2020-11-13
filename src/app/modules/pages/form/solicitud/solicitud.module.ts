import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolicitudRoutingModule } from './solicitud-routing.module';
import { SolicitudComponent } from './solicitud.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SolicitudComponent],
  imports: [
    CommonModule,
    SolicitudRoutingModule,
    SharedModule
  ]
})
export class SolicitudModule { }
