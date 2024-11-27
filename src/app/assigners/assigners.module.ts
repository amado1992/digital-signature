import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListadoComponent } from './components/listado/listado.component';
import { SharedModule } from '../shared/shared.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { AssignersRoutingModule } from './assigners-routing/assigners-routing.module';
import { MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ListadoComponent],
  imports: [
    CommonModule,
    AssignersRoutingModule,
    SharedModule,
    Ng2SearchPipeModule,
    FormsModule,
    // NgxPaginationModule,
    // MdbCollapseModule,
    MatPaginatorModule,
    MatTableModule,
    MatProgressSpinnerModule,
     //material
     MatCardModule,
     MatTooltipModule,
     MatSortModule,
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
export class AssignersModule {}
