import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, delay, map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginCall, LoginRes, Rol } from '../models/login';
import { UserRes } from '../models/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from 'src/app/users/interfaces/user.interface';
import { StorageMap } from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$ = new BehaviorSubject<User | null>(null);
  private api = environment.api;
  private isLogged = new BehaviorSubject<boolean>(false);
  private isSuperAdmin = new BehaviorSubject<boolean>(false);
  private showSpinner$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private route: Router,
    private jwtHelper: JwtHelperService,
    private storageMap: StorageMap
  ) { }

  getshowSpinner(): Observable<boolean> {
    return this.showSpinner$;
  }

  /**
   * Description: Function para autenticar usuarios
   * Segunda en llamarse, se llama al endpoint encargado de autenticar usuarios
   * @param {LoginCall} userData: alores de usuario/clave
   * @returns {any}
   *  */
  autenticarUsuario(userData: LoginCall): Observable<LoginRes> {
    return this.http.post<LoginRes>(this.api + 'authenticate', userData);
  }

  /**
   * Description: Function para confirmar registro de usuarios
   * @param {string} token
   * @returns {any}
   *  */
  confirmEmail(token: any): Observable<any> {
    return this.http.post<any>(this.api + 'confirmCreateUser', token);
  }

  /**
   * Description: Function login
   * Primero en llamarse
   * @param {LoginCall} userData
   * @returns {any}
   *  */
  login(userData: LoginCall): void {
    this.showSpinner$.next(true);
    this.autenticarUsuario(userData)
      .pipe(delay(2000))
      .pipe(tap((res) => this.verificaValidezToken(res)))
      .subscribe((s) => {
        this.showSpinner$.next(false);
      });
  }

  /**
   * Description: Function para manejar login de usuario, verifica la existencia de un tocken de autenticación, en caso contrario retorna error
   * @param {LoginRes} res
   * @returns {any}
   *  */
  private verificaValidezToken(res: any): void {
    // console.log(res.username);
    const token = res?.token;
    // if (res.ok && token)
    if (token) {
      try {
        //Almacenamos toda la respuesta para utilizarla en el modulo "Profile"
        localStorage.setItem('profile', JSON.stringify(res.userDate));
        //Almacenamos el token del usuario que inició sesión en el localstorage del browser
        localStorage.setItem('token', token);
        //Almacenamos el username del usuario que inició sesión en el localstorage del browser
        localStorage.setItem('username', res.userDate.username);
        //Almacenamos los roles del usuario que inició sesión en el localstorage del browser
        localStorage.setItem(
          'roles',
          JSON.stringify(res.userDate.rolRequestDto)
        );
        //Almacenamos el id del cliente del usuario que inició sesión en el localstorage del browser
        if (res.userDate.clientDTO) {
          localStorage.setItem(
            'clientId',
            JSON.stringify(res.userDate.clientDTO.id)
          );
          localStorage.setItem(
            'clientName',
            JSON.stringify(res.userDate.clientDTO.name)
          );
        }
        //Y eliminamos el key de usuario inválido
        localStorage.removeItem('userInvalid');
      } catch (error) {
        console.log('Error obteniendo token');
      }

      this.route.navigate(['/dashboard']);
    } else {
      console.log('Error obteniendo token de usuario');
    }
  }

  /**
   * Description: Obtener roles/permisos por usuario
   * @param {number} id
   * @returns {any}
   *  */
  getUserCall(id: number): Observable<UserRes> {
    return this.http.get<UserRes>(
      `${this.api}get_usuarios_rol_permiso_byIdusuario/${id}`
    );
  }

  /**
   * Description: Obtener roles/permisos por usuario
   * @param {number} id
   * @returns {any}
   *  */
  getUserInfo(): Observable<any> {
    return this.http.get<UserRes>(
      `${this.api}myDatesUser`
    );
  }

  getIsLogged(): Observable<boolean> {
    return this.isLogged;
  }

  getIsAdmin(): Observable<boolean> {
    return this.isSuperAdmin;
  }

  logout(): void {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('roles');
      localStorage.removeItem('clientId');
      localStorage.removeItem('clientName');
      localStorage.removeItem('username');

      this.storageMap.delete('userInvalid').subscribe(() => { });
    } catch (error) {
      throw error;
    }
    this.isLogged.next(false);
    this.isSuperAdmin.next(false);
    this.user$.next(null);
    this.route.navigate(['/login']);
  }

  validateLogin(): void {
    let token: string | null;
    token = localStorage.getItem('token');
    try {
      token = localStorage.getItem('token');
    } catch (error) {
    }

    //OJO, muy importante, desloguea al usuario sino encuentra el token almacenado en el localstorage del browser
    if (!token) {
      this.isLogged.next(false);
      return;
    }

    //Verificamos rol de usuario
    this.getUserInfo().subscribe((res) => {
      this.user$.next(res);
      try {
        localStorage.setItem('user', JSON.stringify(res));
      } catch (err) {
        console.log(err);
        throw err;
      }

      if (res &&
        res.rolRequestDto &&
        res.rolRequestDto.length > 0 &&
        res.rolRequestDto.filter((e: any) => e.name === 'Superadmin').length > 0) {
        this.isSuperAdmin.next(true);
        return;
      }
      this.isSuperAdmin.next(false);
    });

    this.isLogged.next(true);
  }

  getUserLogged(): Observable<User | null> {
    return this.user$;
  }
}
