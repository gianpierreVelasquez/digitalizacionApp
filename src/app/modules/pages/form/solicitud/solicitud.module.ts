import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SolicitudRoutingModule } from './solicitud-routing.module';
import { SolicitudComponent } from './solicitud.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  declarations: [SolicitudComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SolicitudRoutingModule,
    SharedModule,
    TabsModule.forRoot()
  ]
})
export class SolicitudModule { }
