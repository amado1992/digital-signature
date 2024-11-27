import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';

// Servicio del JWT
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

// Interceptors
import { AuthInterceptorService } from './auth/services/auth-interceptor.service';

// Rutas principales
import { AppRoutingModule } from './app-routing.module';
// Componentes
import { AppComponent } from './app.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { APP_BASE_HREF, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { ImportFileComponent } from './importFile/importFile.component';
import { ApiClientModule } from './api-client/api-client.module';
import { ClientesModule } from './clientes/clientes.module';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RolesModule } from './roles/roles.module';
import { PlanModule } from './plan/plan.module';
import { AssignersModule } from './assigners/assigners.module';
import { MisPlanesModule } from './mis-planes/mis-planes.module';

import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';

import { NgDynamicBreadcrumbModule } from 'ng-dynamic-breadcrumb';
import { EmailConfirmationComponent } from './email-confirmation/components/email-confirmation/email-confirmation.component';
import { ClienteComunModule } from './cliente-comun/cliente-comun.module';

// import { ModalModule } from 'ngx-bootstrap/modal';
// import { ThemeModule } from './theme/theme.module';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    EmailConfirmationComponent,
    // ImportFileComponent
  ],
  imports: [
    BrowserModule,
    BackButtonDisableModule.forRoot({
      preserveScrollPosition: true,
    }),
    //Se importa aqui de manera global porque los servicios que estaremos declarando tiene especificado
    //la propiedad providedIn: 'root'
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    MatMenuModule,
    ReactiveFormsModule,
    // ModalModule,
    MatSnackBarModule,
    NgxSpinnerModule,
    MatProgressSpinnerModule,

    SharedModule,
    ApiClientModule,
    ClientesModule,
    UsersModule,
    DashboardModule,
    RolesModule,
    PlanModule,
    ClienteComunModule,
    // MisPlanesModule,
    AssignersModule,
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    NoopAnimationsModule,
    MatSlideToggleModule,
    NgDynamicBreadcrumbModule,
    // ThemeModule
  ],
  exports: [NgxSpinnerModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
