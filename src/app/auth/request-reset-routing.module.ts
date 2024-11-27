import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestResetComponent } from './components/request-reset/request-reset.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '**', component: RequestResetComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestResetRoutingModule { }
