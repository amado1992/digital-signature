import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MisPlanesComponent } from '../component/mis-planes/mis-planes.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: MisPlanesComponent },
      { path: '**', component: MisPlanesComponent, redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisPlanesRoutingModule {}
