import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RequestResetPasswordCall, RequestResetPasswoodRes } from '../models/request-reset-password';
import { LoginCall, LoginRes } from '../models/login';
import { User, UserRes } from '../models/user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class RequestResetService {

  //private user$ = new BehaviorSubject<User | null>(null);
  private api = environment.api;
  //private isLogged = new BehaviorSubject<boolean>(false);
  //private isAdmin = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private route: Router,
    ) { }

  requestresetpasswordCall( userData: RequestResetPasswordCall, token: string): Observable<RequestResetPasswoodRes> {
    return this.http.post<RequestResetPasswoodRes>(this.api + 'password_reset_verified/' + token, userData);
  }

  EnviarNewPassword( userData: RequestResetPasswordCall, token: string ): void {
    this.requestresetpasswordCall(userData, token).pipe(
      tap(res => this.handleResetP( res ))
    ).subscribe();
  }

  private handleResetP( res: RequestResetPasswoodRes ): void {
    if( res.ok) {
      this.route.navigate(['/login']);
    }
  }
}
