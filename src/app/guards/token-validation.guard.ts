import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenValidationGuard implements CanActivate, CanLoad {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(): Observable<boolean> | boolean {
    /*return this.authService.getIsLogged().pipe(
      tap(res => {
        if(!res) {
          this.router.navigate(['/login']);
          return;
        }
      })
    );*/
    
    if (localStorage.getItem('token')) {
      return true
    }

    this.router.navigate(['/login']);
    return false;
  }

  canLoad(): Observable<boolean> | boolean {
    return this.authService.getIsLogged().pipe(
      tap(res => {
        if (!res) {
          this.router.navigate(['/login']);
          return;
        }
      })
    );
  }
}
