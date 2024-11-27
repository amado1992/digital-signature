import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  BehaviorSubject,
  Observable,
  shareReplay,
  Subscription,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl: string = environment.api;
  public usuarios$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public clientes$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public clientesAPI$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public planes$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  private userServiceSubscription: Subscription | undefined;

  /**
   * Description
   * @param {HttpClient} privatehttp
   *  */
  constructor(private http: HttpClient) {}

  /**
   * Description: Obtiene el total de usuarios registrados
   * @returns {Observable<Cliente[]>}
   *  */
  getTotalUsuarios() {
    this.http
      .get<any[]>(`${this.baseUrl}countUser`)
      .pipe
      // tap((x) => console.log('Listado de usuarios', JSON.stringify(x))),
      // shareReplay(1)
      ()
      .subscribe((receivedItems) => this.usuarios$.next(receivedItems));
  }

  /**
   * Description: Property to get all items de tipo Usuarios
   * @returns {any}
   *  */
  get itemsUsuarios(): Observable<any[]> {
    return this.usuarios$.asObservable();
  }

  /**
   * Description: Obtiene el total de clientes registrados
   * @returns {Observable<Cliente[]>}
   *  */
  getTotalClientes() {
    this.http
      .get<any[]>(`${this.baseUrl}countClient`)
      .pipe
      // tap((x) => console.log('Listado de usuarios', JSON.stringify(x))),
      // shareReplay(1)
      ()
      .subscribe((receivedItems) => this.clientes$.next(receivedItems));
  }

  /**
   * Description: Property to get all items de tipo Clientes
   * @returns {any}
   *  */
  get itemsClientes(): Observable<any[]> {
    return this.clientes$.asObservable();
  }

  /**
   * Description: Obtiene el total de clientes API registrados
   * @returns {Observable<Cliente[]>}
   *  */
  getTotalClientesAPI() {
    this.http
      .get<any[]>(`${this.baseUrl}listApiClient`)
      // .pipe(
      //   tap((x) => console.log('Listado de Clientes API', JSON.stringify(x))),
      //   shareReplay(1)
      // )
      .subscribe((receivedItems) => this.clientesAPI$.next(receivedItems));
  }

  /**
   * Description: Property to get all items de tipo Clientes
   * @returns {any}
   *  */
  get itemsClientesAPI(): Observable<any[]> {
    return this.clientesAPI$.asObservable();
  }

  /**
   * Description: Obtiene el total de Planes registrados
   * @returns {Observable<Cliente[]>}
   *  */
  getTotalPlanes() {
    this.http
      .get<any[]>(`${this.baseUrl}listPlan`)
      // .pipe(
      //   tap((x) => console.log('Listado de Clientes API', JSON.stringify(x))),
      //   shareReplay(1)
      // )
      .subscribe((receivedItems) => this.planes$.next(receivedItems));
  }

  /**
   * Description: Property to get all items de tipo Clientes
   * @returns {any}
   *  */
  get itemsPlanes(): Observable<any[]> {
    return this.planes$.asObservable();
  }
}
