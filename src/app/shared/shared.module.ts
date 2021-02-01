import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SpinnerModule, AseguradoModule, BeneficiarioModule, ModalModule } from './components';
import { UiModalService } from './components/modal/ui-modal/ui-modal.service';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from './components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    AseguradoModule,
    BeneficiarioModule,
    ModalModule,
    NgbTabsetModule,
    ComponentsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    AseguradoModule,
    BeneficiarioModule,
    ModalModule,
    NgbTabsetModule,
    ComponentsModule
  ],
  declarations: [],
  providers: [
    UiModalService
  ]
})
export class SharedModule { }