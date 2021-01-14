import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormularioComponent } from './modules/layout/formulario/formulario.component';

const routes: Routes = [
  {
    path: '',
    component: FormularioComponent,
    children: [
      {
        path: '',
        redirectTo: 'form/solicitud',
        pathMatch: 'full'
      },
      {
        path: 'form',
        loadChildren: () => import('./modules/pages/form/form.module').then(module => module.FormModule)
      },
      {
        path: 'maintance',
        loadChildren: () => import('./modules/pages/maintance/maintance.module').then(module => module.MaintanceModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
