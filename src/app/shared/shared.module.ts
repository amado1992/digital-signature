import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { DialogComponent } from './components/dialog/dialog.component';
import { ItemNamePipe } from './pipes/item-name.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { PasswordComponent } from './components/password/password.component';
import { FormPasswordComponent } from './components/form-password/form-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputUppercaseDirective } from './directives/input-uppercase.directive';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { MainComponent } from './components/main/main.component';
import { HeaderComponent } from './components/header/header.component';

import { TooltipModule } from 'angular-simple-tooltip';
import { FormsModule } from '@angular/forms';
import { PasswordStrengthComponent } from './components/password-strength/password-strength.component';
import { HighlightPipe } from './pipes/highlight.pipe';
import { AnimatedDigitComponent } from './components/animated-digit/animated-digit.component';
import { TokenMessageComponent } from './components/token-message/token-message.component';
import { NoDataFoundComponent } from './components/no-data-found/no-data-found.component';
import { PluralSingularPipe } from './pipes/plural-singular.pipe';
import { AuthModule } from '../auth/auth.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ValidationMessagesComponent } from './components/validation-messages/validation-messages.component';

import { NgDynamicBreadcrumbModule } from 'ng-dynamic-breadcrumb';
import { MatReusableTableComponent } from './components/mat-reusable-table/mat-reusable-table.component';
import { DataPropertyGetterPipe } from './components/mat-reusable-table/data-property-getter.pipe';
import { FilterBoxComponent } from './components/filter-box/filter-box.component';
import { LoadingPanelComponent } from './components/loading-panel/loading-panel.component';

@NgModule({
  declarations: [
    NavbarComponent,
    DialogComponent,
    ItemNamePipe,
    PasswordComponent,
    FormPasswordComponent,
    InputUppercaseDirective,
    MainComponent,
    HeaderComponent,
    PasswordStrengthComponent,
    HighlightPipe,
    AnimatedDigitComponent,
    TokenMessageComponent,
    NoDataFoundComponent,
    PluralSingularPipe,
    ValidationMessagesComponent,
    MatReusableTableComponent,
    DataPropertyGetterPipe,
    FilterBoxComponent,
    LoadingPanelComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatMenuModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    ClipboardModule,
    TooltipModule, // Make `TooltipDirective` available in your module
    AuthModule, //para el uso de la directiva que muestra/oculta las opciones de navegación
    NgDynamicBreadcrumbModule,
  ],
  exports: [
    NavbarComponent,
    ItemNamePipe,
    InputUppercaseDirective,
    HeaderComponent,
    ValidationMessagesComponent,
    PasswordStrengthComponent,
    HighlightPipe,
    AnimatedDigitComponent,
    NoDataFoundComponent,
    PluralSingularPipe,
    MatReusableTableComponent,
    FilterBoxComponent,
    LoadingPanelComponent,
  ],
})
export class SharedModule {}
