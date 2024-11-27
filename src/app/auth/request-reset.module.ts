import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestResetRoutingModule } from './request-reset-routing.module';
import { RequestResetComponent } from './components/request-reset/request-reset.component';


@NgModule({
  declarations: [
    RequestResetComponent
  ],
  imports: [
    CommonModule,
    RequestResetRoutingModule,
    ReactiveFormsModule
  ]
})
export class RequestResetModule { }
