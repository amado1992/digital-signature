import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

import { DetallesComponent } from './plan/components/detalles/detalles.component';
import { MainComponent } from './shared/components/main/main.component';
import { MainComponent as Dashboard } from './dashboard/components/main/main.component';
import { EmailConfirmationComponent } from './email-confirmation/components/email-confirmation/email-confirmation.component';
import { TokenValidationGuard } from './guards/token-validation.guard';

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 64],
};

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    pathMatch: 'full',
  },
  {
    path: 'clientNew',
    loadChildren: () => import('./cliente-comun/cliente-comun.module').then((m) => m.ClienteComunModule)
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./auth/reset-password.module').then((m) => m.ResetPasswordModule),
  },
  {
    path: 'reset-password-error',
    loadChildren: () =>
      import('./auth/reset-password-error.module').then(
        (m) => m.ResetPasswordErrorModule
      ),
  },
  {
    path: 'request-reset/:token',
    loadChildren: () =>
      import('./auth/request-reset.module').then((m) => m.RequestResetModule),
  },
  {
    path: 'test',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule)
  },
  {
    path: 'dashboard',
    component: MainComponent,
     canActivate: [TokenValidationGuard],
    // canLoad: [TokenValidationGuard],
    children: [
      {
        path: '',
        component: Dashboard
      },
      {
        path: 'clientesApi',
        loadChildren: () =>
          import('./api-client/api-client.module').then(
            (m) => m.ApiClientModule
          )
      },
      {
        path: 'clientes',
        loadChildren: () =>
          import('./clientes/clientes.module').then((m) => m.ClientesModule)
      },
      {
        path: 'roles',
        loadChildren: () =>
          import('./roles/roles.module').then((m) => m.RolesModule)
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule)
      },
      {
        path: 'permisos',
        loadChildren: () =>
          import('./assigners/assigners.module').then((m) => m.AssignersModule),
      },
      {
        path: 'planes',
        loadChildren: () =>
          import('./plan/plan.module').then((m) => m.PlanModule)
      },
      {
        path: 'plan/detalles/:id',
        component: DetallesComponent
      },
      {
        path: 'mis-planes',
        loadChildren: () =>
          import('./planes-by-clientes/planes-by-clientes.module').then(
            (m) => m.PlanesByClientesModule
          ),
      },
      {
        path: 'reportes',
        loadChildren: () =>
          import('./reportes/reportes.module').then((m) => m.ReportesModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
      },
      //Cualquier otro path que no coincida con los anteriores definidos, pues redireccionamos hacia el dashboard
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
  { path: 'emailconfirmation', component: EmailConfirmationComponent },
  {
    //Cualquier otro path que no coincida con los anteriores definidos, pues redireccionamos hacia el login
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
