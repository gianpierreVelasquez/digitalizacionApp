import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AseguradoRoutingModule } from './asegurado-routing.module';
import { AseguradoComponent } from './asegurado.component';


@NgModule({
  declarations: [AseguradoComponent],
  imports: [
    CommonModule,
    AseguradoRoutingModule
  ]
})
export class AseguradoModule { }
