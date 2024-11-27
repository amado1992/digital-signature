import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ListadoComponent } from './components/listado/listado.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { TooltipModule } from 'angular-simple-tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SharedModule } from '../shared/shared.module';

// import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { FilterPipe } from '../shared/pipes/filter.pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HighlightDirective } from '../shared/highlight/highlight.pipe';
import { ApiClientRoutingModule } from './api-client-routing/api-client-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ListadoComponent, FilterPipe, HighlightDirective],
  imports: [
    CommonModule,
    ApiClientRoutingModule,
    MatGridListModule,
    // BrowserAnimationsModule,
    MatProgressSpinnerModule,
    TooltipModule, // Make `TooltipDirective` available in your module
    FormsModule,
    Ng2SearchPipeModule,
    MatSnackBarModule,
    ClipboardModule,
    // ModalModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    MatMenuModule,
    MatIconModule,
    // MatFormFieldModule,
    // MatInputModule,
    // MatToolbarModule,
    NgMultiSelectDropDownModule,
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
  providers: [BsModalService, DatePipe,
    {
      provide: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS,
      useValue: {
          _forceAnimations: true
      }
  
}],
})
export class ApiClientModule {}
