import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RespuestaComponent } from './respuesta.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [RespuestaComponent],
  exports: [RespuestaComponent]
})
export class RespuestaModule { }
