import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResetPasswordCall, ResetPasswoodRes } from '../models/reset-password';
import { LoginCall, LoginRes } from '../models/login';
import { User, UserRes } from '../models/user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  //private user$ = new BehaviorSubject<User | null>(null);
  private api = environment.api;
  //private isLogged = new BehaviorSubject<boolean>(false);
  //private isAdmin = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private route: Router,
    ) { }

  resetpasswordCall( userData: ResetPasswordCall ): Observable<ResetPasswoodRes> {
    return this.http.post<ResetPasswoodRes>(this.api + 'password_reset', userData);
  }

  EnviarEmail( userData: ResetPasswordCall ): void {
    this.resetpasswordCall(userData).pipe(
      tap(res => this.handleResetP( res ))
    ).subscribe();
  }

  private handleResetP( res: ResetPasswoodRes ): void {
    if( res.ok) {
      this.route.navigate(['/']);
    }
  }
}
