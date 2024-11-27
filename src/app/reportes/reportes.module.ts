import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ReportesComponent } from './components/reportes/reportes.component';
import { ReportesRoutingModule } from './reportes-routing/reportes-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatIconModule } from '@angular/material/icon';
import { TooltipModule } from 'angular-simple-tooltip';

@NgModule({
  declarations: [ReportesComponent],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    NgxExtendedPdfViewerModule,
    PdfViewerModule,
    MatIconModule,
    TooltipModule,
  ],
})
export class ReportesModule {}
