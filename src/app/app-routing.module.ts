import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormularioComponent } from './modules/layout/formulario/formulario.component';
import { MantenimientoComponent } from './modules/layout/mantenimiento/mantenimiento.component';

const routes: Routes = [
  {
    path: '',
    component: FormularioComponent,
    children: [
      {
        path: '',
        redirectTo: 'form/solicitud',
        pathMatch: 'full',
      },
      {
        path: 'form',
        loadChildren: () => import('./modules/pages/form/form.module').then(module => module.FormModule),
      }
    ]
  },
  {
    path: '',
    component: MantenimientoComponent,
    children: [
      {
        path: '',
        redirectTo: 'mantenimiento',
        pathMatch: 'full'
      },
      {
        path: 'mantenimiento',
        loadChildren: () => import('./modules/pages/mantenimiento/mantenimiento.module').then(module => module.MantenimientoModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
