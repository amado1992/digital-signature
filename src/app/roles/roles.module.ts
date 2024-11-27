import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListadoComponent } from './components/listado/listado.component';
import { SharedModule } from '../shared/shared.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { TooltipModule } from 'angular-simple-tooltip';
import { ReactiveFormsModule } from '@angular/forms';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RolesRoutingModule } from './roles-routing/roles-routing.module';

//material
import { MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button'; 

@NgModule({
  declarations: [ListadoComponent],
  imports: [
    CommonModule,
    RolesRoutingModule,
    SharedModule,
    FormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    TooltipModule,
    NgMultiSelectDropDownModule,
    MdbCollapseModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    //material
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  exports: [ListadoComponent],
  providers: [{
    provide: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS,
    useValue: {
        _forceAnimations: true
    }
}]
})
export class RolesModule {}
