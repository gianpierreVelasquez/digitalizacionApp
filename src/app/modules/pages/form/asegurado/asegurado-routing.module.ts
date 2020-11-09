import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AseguradoComponent } from './asegurado.component';


const routes: Routes = [
  {
    path: '',
    component: AseguradoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AseguradoRoutingModule { }
