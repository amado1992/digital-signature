import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordErrorComponent } from './components/reset-password-error/reset-password-error.component';
import { ResetPasswordErrorRoutingModule } from './reset-password-error-routing.module';


@NgModule({
  declarations: [
    ResetPasswordErrorComponent
  ],
  imports: [
    CommonModule,
    ResetPasswordErrorRoutingModule,
    ReactiveFormsModule
  ]
})
export class ResetPasswordErrorModule { }
