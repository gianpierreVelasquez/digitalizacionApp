import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficiarioRoutingModule } from './beneficiario-routing.module';
import { BeneficiarioComponent } from './beneficiario.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [BeneficiarioComponent],
  imports: [
    CommonModule,
    BeneficiarioRoutingModule,
    SharedModule
  ]
})
export class BeneficiarioModule { }
