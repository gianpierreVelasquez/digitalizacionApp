import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficiarioRoutingModule } from './beneficiario-routing.module';
import { BeneficiarioComponent } from './beneficiario.component';


@NgModule({
  declarations: [BeneficiarioComponent],
  imports: [
    CommonModule,
    BeneficiarioRoutingModule
  ]
})
export class BeneficiarioModule { }
