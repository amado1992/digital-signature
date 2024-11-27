import { Injectable } from '@angular/core';
import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs/internal/Observable';
import { Cliente } from 'src/app/clientes/interfaces/clientes.interface';
import { BehaviorSubject, map, shareReplay, tap } from 'rxjs';
import { handlerResponseError } from 'src/app/utils/common-configs';
import { UserDto } from 'src/app/shared/dto/userDto';

const httpOptions = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
  })
};


@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public itemsClientes$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );
  // token = localStorage.getItem('token');

  // headers = new HttpHeaders();
  // .set('Access-Control-Allow-Origin', '*')
  // .set(
  //   'Access-Control-Allow-Methods',
  //   'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  // )
  // .set('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  // .set('Content-Type', 'application/json')
  // .set('Authorization', `Bearer ${this.token}`);

  // headers = new HttpHeaders()
  //   .set('Content-Type', 'application/json')
  //   .set(
  //     'access-control-allow-origin',
  //     'https://localhost:8074/DigitalSignatureRestApi/'
  //   )
  //   .set('Access-Control-Allow-Credentials', 'true')
  //   .set('Authorization', `Bearer ${this.token}`);

  private baseUrl: string = environment.api;
  /**
   * Description
   * @param {HttpClient} privatehttp
   *  */
  constructor(private http: HttpClient) {}

  /**
   * Description: Service para listar los usuarios existentes
   * @returns {Observable<Cliente[]>}
   *  */
  getListadoUsuarios(): Observable<User[]> {
    return this.http
      .get<User[]>(
        `${this.baseUrl}listUser`
        // {
        //   headers: this.headers,
        // }
      )
      .pipe(
        // tap((x) =>
        //   //console.log("I'm only getting the data once", JSON.stringify(x))
        // ),
        // tap((x) => {
        //   // You can write any other code here, inside the tap
        //   // to perform any other operations
        //   console.log("I'm only getting the data once", JSON.stringify(x));
        // }),
        shareReplay(1)
      );
  }
  /**
   * Description: Service para eliminar un usuario
   * @param {User} item: parámetro de tipo User
   * @returns {any}
   *  */
  deletedItem(item: User): Observable<any> {
    return this.http.post<User>(
      `${this.baseUrl}deleteUser/${item.id}`,
      ''
      // {
      //   headers: this.headers,
      // }
    );
  }

  /**
   * Description: Service para registrar un nuevo usuario
   * @param {User} item
   * @returns {any}
   *  */
  addItem(item: User): Observable<any> {
    return this.http.post<User>(`${this.baseUrl}register`, item);
  }

  /**
   * Description: Service para registrar un nuevo usuario
   * @param {User} item
   * @returns {any}
   *  */
  // updateItem(item: User): Observable<any> {
  //   return this.http.post<User>(`${this.baseUrl}register`, item, {
  //     headers: this.headers,
  //   });
  // }

  /**
   * Description: Se obtienen todos los clientes que no estan asociados todavía a un usuarios
   * @returns {any}
   *  */
  fetchListClientes() {
    return this.http
      .get<Cliente[]>(
        `${this.baseUrl}listClient`
        // {
        //   headers: this.headers,
        // }
      )
      .pipe(
        // tap((x) =>
        //   //console.log("I'm only getting the data once", JSON.stringify(x))
        // ),
        tap((x) => {
          // You can write any other code here, inside the tap
          // to perform any other operations
          // console.log("I'm only getting the data once", JSON.stringify(x));
        }),
        shareReplay(1)
      )
      .subscribe(
        (receivedItems) => this.itemsClientes$.next(receivedItems),
        (err: HttpErrorResponse) => {
          handlerResponseError(err);
        }
      );
  }

  addUser(userDto: UserDto): Observable<any> {
    return this.http.post<UserDto>(`${this.baseUrl}register`, userDto, httpOptions);
  }
}
