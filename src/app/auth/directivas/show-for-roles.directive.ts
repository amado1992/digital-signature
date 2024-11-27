//https://dev.to/akotech/control-de-acceso-basado-en-rolesrbac-en-angular-6gf
import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { distinctUntilChanged, map, Subscription, tap } from 'rxjs';
import { Rol } from '../models/login';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appShowForRoles]',
})
export class ShowForRolesDirective implements OnInit, OnDestroy {
  _roles: Rol[] = [];
  @Input('appShowForRoles') allowedRoles?: string[];
  private sub?: Subscription;

  constructor(
    private authService: AuthService,
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    //Obtenemos, en caso de existir, los valores del historial de búsqueda que hemos realizado previamente
    this._roles = JSON.parse(localStorage.getItem('roles')!) || [];
    this.sub = this.authService.user$ // .getUserLogged()
      // .getUserInfo()
      .pipe(
        map(
          //
          // (user) => Boolean(this.allowedRoles?.includes('Superadmin'))
          // (user) => Boolean(this.allowedRoles?.includes('AdminGestion'))
          (user) => Boolean(this.getResult(this._roles))
          //  (user) => this.getResult(user!?.rolRequestDto)
          // (user) =>
          // Boolean(
          //     user!.rolRequestDto.filter((e: any) =>
          //       this.allowedRoles?.includes(e.name)
          //     ).length > 0
          // (user) =>
          //   Boolean(
          //     user!?.rolRequestDto.filter(
          //       (e: any) => e.name in this.allowedRoles!
          //     )
          //   )
          // {
          //   if (user!.rolRequestDto) {
          //   }
          // }
        ),
        // tap((user) => console.log(user)),
        distinctUntilChanged(), // <--- incluido para ejecutar la lógica de renderizado solo si cambia resultado de la condicion anterior.
        tap((hasRole) =>
          hasRole
            ? this.viewContainerRef.createEmbeddedView(this.templateRef)
            : this.viewContainerRef.clear()
        )
      )
      .subscribe((res) => {
        // console.log('Response from User Info: ' + res);
      });
  }

  private getResult(roles: Rol[]): boolean {
    // debugger;
    let result: boolean = false;
    // roles.forEach((element: Rol) => {
    //   console.log(element.name);
    //   if (this.allowedRoles?.includes(element.name)) {
    //     result = true;
    //     return; // en cuanto encuentre el primer rol que coincida con los permitidos, andando!!!
    //   } else result = false;
    // });
    // for (const point of roles) {
    //   console.log(point.name);
    //   if (this.allowedRoles?.includes(point.name)) {
    //     result = true;
    //     // return; // en cuanto encuentre el primer rol que coincida con los permitidos, andando!!!
    //   } else result = false;
    // }
    roles.map((r) => {
      let result1 = this.allowedRoles?.find((a) => a === r.name);
      if (result1) {
        result = true;
      } else {
        result = false;
      }
    });
    return result;
  }
}
