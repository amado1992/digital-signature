import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

import { ListadoComponent } from './components/listado/listado.component';
import { PlanesByClientesRoutingModule } from './planes-by-clientes-routing/planes-by-clientes-routing.module';

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
  declarations: [ListadoComponent],
  imports: [
    CommonModule,
    FormsModule,
    PlanesByClientesRoutingModule,
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
export class PlanesByClientesModule {}
