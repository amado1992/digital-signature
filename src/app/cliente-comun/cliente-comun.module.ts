import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteComunRoutingModule } from './cliente-comun-routing.module';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
import { CreateClientComponent } from './create-client/create-client.component';
import {MatCardModule} from '@angular/material/card'; 
import {MatInputModule} from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {MatToolbarModule} from '@angular/material/toolbar'; 

@NgModule({
  declarations: [CreateClientComponent],
  imports: [
    CommonModule,
    ClienteComunRoutingModule,

    FormsModule,
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
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatToolbarModule

  ],
  providers: [BsModalService],
})
export class ClienteComunModule { }
