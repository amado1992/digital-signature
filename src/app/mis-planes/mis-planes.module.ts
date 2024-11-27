import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MisPlanesComponent } from './component/mis-planes/mis-planes.component';
import { MisPlanesRoutingModule } from './mis-planes-routing/mis-planes-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { TooltipModule } from 'angular-simple-tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
@NgModule({
  declarations: [MisPlanesComponent],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    TooltipModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatTooltipModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    NgMultiSelectDropDownModule,
  ],
})
export class MisPlanesModule {}
