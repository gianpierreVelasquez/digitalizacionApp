import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecimalValidatorDirective } from '../helper/decimal-validator.directive';
import { IntergerValidatorDirective } from '../helper/interger-validator.directive';


@NgModule({
  declarations: [
    DecimalValidatorDirective,
    IntergerValidatorDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DecimalValidatorDirective,
    IntergerValidatorDirective
  ]
})
export class ComponentsModule { }
