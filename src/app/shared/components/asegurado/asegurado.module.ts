import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AseguradoComponent } from './asegurado.component';
import { ModalModule } from '../modal/modal.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ObservacionModule } from '../observacion/observacion.module';
import { AutosizeModule } from 'ngx-autosize';
import { DireccionModule } from '../direccion/direccion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    NgSelectModule,
    ObservacionModule,
    AutosizeModule,
    DireccionModule
  ],
  declarations: [AseguradoComponent],
  exports: [AseguradoComponent]
})
export class AseguradoModule { }