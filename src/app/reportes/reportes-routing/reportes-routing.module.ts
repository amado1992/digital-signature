import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReportesComponent } from '../components/reportes/reportes.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ReportesComponent },
      { path: '**', component: ReportesComponent, redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesRoutingModule {}
