import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListadoComponent } from './components/listado/listado.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TooltipModule } from 'angular-simple-tooltip';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UsersRoutingModule } from './users-routing/users-routing.module';
import { CreateUserDialogComponent } from './components/create-user-dialog/create-user-dialog.component';
import { AppRoutingModule } from '../app-routing.module';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatRadioModule} from '@angular/material/radio'; 

@NgModule({
  declarations: [ListadoComponent, CreateUserDialogComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatProgressSpinnerModule,
    TooltipModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    FormsModule,
    SharedModule,
    NgMultiSelectDropDownModule,

    //material
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatRadioModule
  ],
  exports: [ListadoComponent],
  providers: [BsModalService,{
    provide: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS,
    useValue: {
        _forceAnimations: true
    }
}],
})
export class UsersModule {}
