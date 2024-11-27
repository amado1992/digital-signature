import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ShowForRolesDirective } from './directivas/show-for-roles.directive';


@NgModule({
  declarations: [LoginComponent, LoginFormComponent, ShowForRolesDirective],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ],
  exports: [ShowForRolesDirective],
})
export class AuthModule {}
