import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoComponent } from '../components/listado/listado.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ListadoComponent },
      { path: '**', component: ListadoComponent, redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
