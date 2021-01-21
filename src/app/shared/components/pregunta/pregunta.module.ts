import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreguntaComponent } from './pregunta.component';
import { ObservacionModule } from '../observacion/observacion.module';
import { ModalModule } from '../modal/modal.module';
import { RespuestaModule } from '../respuesta/respuesta.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RespuestaModule,
    ObservacionModule,
    ModalModule
  ],
  declarations: [PreguntaComponent],
  exports: [PreguntaComponent]
})
export class PreguntaModule { }
