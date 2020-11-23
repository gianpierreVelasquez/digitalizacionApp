import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AseguradoComponent } from './asegurado.component';
import { ModalModule } from '../modal/modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule
  ],
  declarations: [AseguradoComponent],
  exports: [AseguradoComponent]
})
export class AseguradoModule { }
