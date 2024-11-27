import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { UserRes, User } from 'src/app/auth/models/user';
import { environment } from 'src/environments/environment';
import { UserFront, UsersRes } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api = environment.api;
  private users$ = new BehaviorSubject<UserFront[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Description
   * @returns {any}
   *  */
  getUsersCall(): void {
    this.http
      .get<UsersRes>(this.api + 'get_usuarios_rol_permiso')
      .pipe(tap((res) => this.handleUsers(res)))
      .subscribe();
  }

  /**
   * Description
   * @param {number} id
   * @returns {any}
   *  */
  getUserCall(id: number): Observable<UserRes> {
    return this.http.get<UserRes>(
      `${this.api}get_usuarios_rol_permiso_byIdusuario/${id}`
    );
  }

  /**
   * Description
   * @param {number} id
   * @returns {any}
   *  */
  getUser(id: number): Observable<User | null> {
    return this.getUserCall(id).pipe(map((res) => this.handleUser(res)));
  }

  /**
   * Description
   * @param {UserRes} res
   * @returns {any}
   *  */
  private handleUser(res: UserRes): User | null {
    return res.ok ? res.data : null;
  }

  /**
   * Description
   * @param {UsersRes} res
   * @returns {any}
   *  */
  private handleUsers(res: UsersRes): void {
    if (!res.ok) return;
    const users: UserFront[] = res.data.map((u) => ({
      ...u,
      roles: u.roles.join().split(',').join(', '),
    }));
    this.users$.next(users);
  }

  /**
   * Description
   * @returns {any}
   *  */
  getUsers(): Observable<UserFront[]> {
    return this.users$;
  }
}
