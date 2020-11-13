import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AseguradoRoutingModule } from './asegurado-routing.module';
import { AseguradoComponent } from './asegurado.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AseguradoComponent],
  imports: [
    CommonModule,
    AseguradoRoutingModule,
    SharedModule
  ]
})
export class AseguradoModule { }
