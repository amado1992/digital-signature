//https://dev.to/juliandierkes/two-ways-of-using-angular-services-with-the-httpclient-51ef
//https://stackoverflow.com/questions/67506586/how-to-share-httpclient-get-with-behaviorsubject
import { Injectable } from '@angular/core';
import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
// import { Observable, BehaviorSubject, Subject, tap, catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { delay } from 'rxjs/internal/operators/delay';
// import { merge, shareReplay } from 'rxjs/operators';
import { Rol } from 'src/app/roles/interfaces/rol.interface';

import {
  merge,
  Observable,
  BehaviorSubject,
  Subject,
  throwError,
  of,
} from 'rxjs';
import {
  catchError,
  debounce,
  debounceTime,
  map,
  scan,
  shareReplay,
  tap,
} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Permiso } from '../interfaces/assigners.interface';
import { handlerResponseError } from 'src/app/utils/common-configs';

@Injectable({
  providedIn: 'root',
})
export class AssignersService {
  //initiate the new Loading variable via BehaviorSubject and set it to "true" from the beginning.
  public loading$ = new BehaviorSubject<boolean>(true);

  token = localStorage.getItem('token');

  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${this.token}`);
  private baseUrl: string = environment.api;

  public items$: BehaviorSubject<Rol[]> = new BehaviorSubject<Rol[]>([]);
  public itemsPermisos$: BehaviorSubject<Permiso[]> = new BehaviorSubject<
    Permiso[]
  >([]);
  /**
   * Description
   * @param {HttpClient} privatehttp
   *  */
  constructor(private http: HttpClient) {}

  // getListadoPermisos(): Observable<any[]> {
  //   return this.http
  //     .get<any[]>(`${this.baseUrl}listApiClient`, {
  //       headers: this.headers,
  //     })
  //     .pipe(delay(2000));
  // }
  //TODO:Solo se implementarán peticiones de tipo post para adicionar

  /**
   * Description: Se obtiene el listado de Roles.
   * @returns {any}
   *  */
  fetchList() {
    this.http
      .get<Rol[]>(`${this.baseUrl}listRoles`, {
        headers: this.headers,
      })
      .pipe(
        // tap((x) =>
        //   //console.log("I'm only getting the data once", JSON.stringify(x))
        // ),
        tap((x) => {
          // You can write any other code here, inside the tap
          // to perform any other operations
          // console.log("I'm only getting the data once", JSON.stringify(x))
        }),
        shareReplay(1)
      )
      .subscribe(
        (receivedItems) => this.items$.next(receivedItems),
        (err: HttpErrorResponse) => {
          handlerResponseError(err);
        }
      );
  }

  /**
   * Description: Se obtiene el listado de Roles.
   * @returns {any}
   *  */
  fetchListObservable() {
    return this.http.get<Rol[]>(`${this.baseUrl}listRoles`, {
      headers: this.headers,
    });
  }

  /**
   * Description: Se obtiene el listado de permisos
   * @returns {any}
   *  */
  fetchListPermisos() {
    this.http
      .get<Permiso[]>(`${this.baseUrl}listarOperationType`, {
        headers: this.headers,
      })
      .pipe(debounceTime(50000))
      .subscribe(
        (receivedItems) => {
          {
            this.itemsPermisos$.next(receivedItems);
          }
        },
        (err: HttpErrorResponse) => {
          handlerResponseError(err);
        }
      );
  }

  /**
   * Description: Property to get all items de tipo Rol
   * @returns {any}
   *  */
  get items(): Observable<Rol[]> {
    return this.items$.asObservable();
  }

  /**
   * Description: Property to get all items de tipo Permisos
   * @returns {any}
   *  */
  get itemsPermisos(): Observable<any[]> {
    return this.itemsPermisos$.asObservable();
  }

  // Action Stream
  // private itemInsertedSubject = new Subject<any>();
  // productInsertedAction$ = this.itemInsertedSubject.asObservable();

  // Merge the action stream that emits every time an item is added
  // with the data stream
  // allItems$ = merge(this.items, this.productInsertedAction$);
  myArray: Rol[] = [
    {
      id: 102,
      name: 'Cliente1',
      description: 'Operaciones para Clientes',
      operationTypes: [],
      status: true,
    },
    {
      id: 103,
      name: 'Facilitador1',
      description:
        'El rol de facilitador tiene privilegios predeterminados relacionados con los materiales del curso, el libro de calificaciones, el calendario, los anuncios, los debates y los grupos, para ayudar a los profesores en el transcurso de un curso.',
      operationTypes: [],
      status: true,
    },
    {
      id: 104,
      name: 'Invitado1',
      description:
        'El rol de invitado permite que alumnos potenciales, exalumnos y padres puedan explorar Blackboard Learn sin posibilidad de modificar usuarios, cursos o contenido. Los usuarios con rol de invitado son usuarios no autenticados.',
      operationTypes: [],
      status: true,
    },
  ];

  /**
   * Description
   * @returns {any}
   *  */
  getAll(): Rol[] {
    return this.items$.getValue();
  }

  /**
   * Description
   * @param {Rol} item
   * @returns {any}
   *  */
  addItem(item: Rol) {
    const currentItems: Rol[] = this.getAll();
    this.http
      .post<Rol>(`${this.baseUrl}createRole`, item, {
        headers: this.headers,
      })
      .subscribe({
        next: (data) => {
          currentItems.push(data);
          this.items$.next(currentItems);
          Swal.fire(
            'Rol adicionado!',
            `El rol con identificador <strong>${item.name}</strong> ha sido adicionado correctamente.`,
            'success'
          );
          // console.log(data);
        },
        error: (err: HttpErrorResponse) => {
          handlerResponseError(err);
        },
      });
  }

  /**
   * Description: Service para eliminar un usuario
   * @param {User} item: parámetro de tipo User
   * @returns {any}
   *  */
  deletedItem(item: Rol): Observable<any> {
    return this.http
      .post<Rol>(`${this.baseUrl}deleteRole/${item.id}`, item, {
        headers: this.headers,
      })
      .pipe(
        map((data: any) => {
          return data['success'] && data['success'] === true ? true : false;
        }),
        tap((success) => {
          if (success) {
            this.deleteItemLocalService(item.id!);
          }
        }), // when success, delete the item from the local service
        catchError((err) => {
          return of(false);
        })
      );
  }

  /**
   * Description
   * @param {number} id
   * @returns {any}
   *  */
  deleteItemLocalService(id: number): boolean {
    const currentItems: Rol[] = this.getAll();
    if (currentItems.length > 0) {
      const index1 = currentItems.findIndex((element) => {
        return element.id === id;
      });
      if (index1 >= 0) {
        currentItems.splice(index1, 1);
        this.items$.next(currentItems);
        return true;
      }
    }
    return false;
  }

  // This is a property
  // It executes the http request when subscribed to the first time
  // And emits the returned array of items.
  // All other times, it replays (and emits) the items due to the shareReplay.
  // getItems$ = this.http
  //   .get<Rol[]>(`${this.baseUrl}listRoles`, {
  //     headers: this.headers,
  //   })
  //   .pipe(
  //     tap((x) =>
  //       console.log("I'm only getting the data once", JSON.stringify(x))
  //     ),
  //     tap((x) => {
  //       // You can write any other code here, inside the tap
  //       // to perform any other operations
  //     }),
  //     shareReplay(1)
  //   );

  // Action Stream
  // private itemInsertedSubject = new Subject<Rol>();
  // productInsertedAction$ = this.itemInsertedSubject.asObservable();

  // Merge the action stream that emits every time an item is added
  // with the data stream
  // allItems$ = merge(this.getItems$, this.productInsertedAction$).pipe(
  //   scan((acc: Rol[], value: Rol) => [...acc, value]),
  //   catchError((err) => {
  //     console.error(err);
  //     return throwError(err);
  //   })
  // );

  /**
   * Description
   * @param {Rol} item
   * @returns {any}
   *  */
  updateItem(item: Rol): Observable<any> {
    return this.http.put<Rol>(`${this.baseUrl}updateRole/${item.id}`, item, {
      headers: this.headers,
    });
  }

  updateItemLocalService(id: number, item: Rol): boolean {
    const currentItems: Rol[] = this.getAll();
    if (currentItems.length > 0) {
      const index1 = currentItems.findIndex((element) => {
        return element.id === id;
      });
      if (index1 >= 0) {
        currentItems[index1] = item;
        this.items$.next(currentItems);
        console.log(currentItems);
        return true;
      }
    }
    return false;
  }
}
