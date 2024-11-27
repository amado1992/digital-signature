import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UsersComponent } from './pages/users/users.component';
import { SharedModule } from '../shared/shared.module';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { FormUserComponent } from './components/form-user/form-user.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({ 
  declarations: [
    UsersComponent,
    UsersListComponent,
    UpdateUserComponent,
    NewUserComponent,
    FormUserComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }
