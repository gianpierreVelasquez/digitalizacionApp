import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner.component';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule
  ],
  declarations: [SpinnerComponent],
  exports: [SpinnerComponent]
})
export class SpinnerModule { }
