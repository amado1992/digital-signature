import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordErrorComponent } from './components/reset-password-error/reset-password-error.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '**', component: ResetPasswordErrorComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResetPasswordErrorRoutingModule { }
