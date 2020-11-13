import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SpinnerModule } from './components';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SpinnerModule,
    ],
    exports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SpinnerModule,
    ],
    declarations: [

    ],
    providers: [
        
    ]
  })
  export class SharedModule { }