import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'solicitud',
        loadChildren: () => import('./solicitud/solicitud.module').then(module => module.SolicitudModule)
      },
      {
        path: 'asegurado',
        loadChildren: () => import('./asegurado/asegurado.module').then(module => module.AseguradoModule)
      },
      {
        path: 'beneficiario',
        loadChildren: () => import('./beneficiario/beneficiario.module').then(module => module.BeneficiarioModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormRoutingModule { }
