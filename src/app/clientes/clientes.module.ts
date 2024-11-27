import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ListadoComponent } from './components/listado/listado.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TooltipModule } from 'angular-simple-tooltip';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RouterModule, Router } from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

// import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';

import { ClientesRoutingModule } from './clientes-routing/clientes-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ClientCertificatesDialogComponent } from './client-certificates/client-certificates-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [ListadoComponent, ClientCertificatesDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ClientesRoutingModule,
    // BrowserAnimationsModule,
    MatProgressSpinnerModule,
    TooltipModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NgMultiSelectDropDownModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    SharedModule,
    RouterModule,
    // RxReactiveFormsModule,
    //material
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  exports: [ListadoComponent],
  providers: [BsModalService, {
    provide: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS,
    useValue: {
        _forceAnimations: true
    }
}],
})
export class ClientesModule {}
