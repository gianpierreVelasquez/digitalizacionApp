import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeneficiarioComponent } from './beneficiario.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [BeneficiarioComponent],
  exports: [BeneficiarioComponent]
})
export class BeneficiarioModule { }
