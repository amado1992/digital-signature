//https://stackoverflow.com/questions/45030421/bootstrap-three-column-positioning
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListadoComponent } from './components/listado/listado.component';
import { SharedModule } from '../shared/shared.module';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { TooltipModule } from 'angular-simple-tooltip';
import { ReactiveFormsModule } from '@angular/forms';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { DetallesComponent } from './components/detalles/detalles.component';
import { RouterModule } from '@angular/router';

import { MatTreeModule } from '@angular/material/tree';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkDetailRowDirective } from '../utils/cdk-detail-row.directive';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlanRoutingModule } from './plan-routing/plan-routing.module';
import { AssociatePlanDialogComponent } from './components/associate-plan-dialog/associate-plan-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button'; 
import { MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [ListadoComponent, DetallesComponent, CdkDetailRowDirective, AssociatePlanDialogComponent],
  imports: [
    CommonModule,
    PlanRoutingModule,
    FormsModule,
    RouterModule, //useful to used [routerLink]="['/pais',pais.alpha2Code]" in html component
    Ng2SearchPipeModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    TooltipModule,
    NgMultiSelectDropDownModule,
    MdbCollapseModule,
    MatListModule,
    MatIconModule,
    MatTreeModule,
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule,
    CdkTableModule,
    MatInputModule, //avoid mat-form-field must contain a MatFormFieldControl error
    MatFormFieldModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    MatButtonModule,
    SharedModule,

    //material
    MatCardModule,
    MatSelectModule,
    MatSortModule,
    MatProgressSpinnerModule
  ],
  exports: [ListadoComponent, DetallesComponent],
  providers: [{
    provide: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS,
    useValue: {
        _forceAnimations: true
    }
}]
})
export class PlanModule {}
