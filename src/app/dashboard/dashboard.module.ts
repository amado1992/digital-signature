import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { SharedModule } from '../shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, SharedModule, NgApexchartsModule],
})
export class DashboardModule {}
