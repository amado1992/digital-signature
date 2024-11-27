import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  DatoBancario,
  Cliente,
  DatoBancarioCliente,
  CreateUser,
} from '../interfaces/clientes.interface';
import { delay } from 'rxjs/internal/operators/delay';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject, shareReplay, tap } from 'rxjs';
import { ClientCertificateDto } from 'src/app/shared/dto/ClientCertificateDto';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  public itemsClientes$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );
  token = localStorage.getItem('token');

  // headers = new HttpHeaders()
  //   .set('Content-Type', 'application/json')
  //   .set('Authorization', `Bearer ${this.token}`);

  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set(
      'access-control-allow-origin',
      'https://localhost:8074/DigitalSignatureRestApi/'
    )
    .set('Access-Control-Allow-Credentials', 'true')
    .set('Authorization', `Bearer ${this.token}`);

  private baseUrl: string = environment.api;
  /**
   * Description: Constructor de la clase
   * @param {HttpClient} privatehttp
   *  */
  constructor(private http: HttpClient) { }

  /**
   * Description
   * @returns {Observable<Cliente[]>}
   *  */
  getListadoClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.baseUrl}listClient`, {
      headers: this.headers,
    });
  }

  /**
   * Description: Property to get all items de tipo Rol
   * @returns {any}
   *  */
  get itemsClientes(): Observable<Cliente[]> {
    return this.itemsClientes$.asObservable();
  }

  /**
   * Description: Se obtienen todos los clientes que no estan asociados todavía a un usuarios
   * @returns {any}
   *  */
  fetchListClientes() {
    this.http
      .get<Cliente[]>(`${this.baseUrl}listClient/`, {
        headers: this.headers,
      })
      .pipe(
        tap((x) => console.log('Listado de clientes', JSON.stringify(x))),
        shareReplay(1)
      )
      .subscribe((receivedItems) => this.itemsClientes$.next(receivedItems));
  }

  /**
   * Description: Function para eliminar un Cliente
   * @param {Cliente} item: parámetro de tipo Cliente
   * @returns {any}
   *  */
  deletedItem(item: Cliente): Observable<any> {
    return this.http.delete<Cliente>(`${this.baseUrl}deleteClient/${item.id}`, {
      headers: this.headers,
    });
  }

  /**
   * Description: Service para registrar un nuevo cliente
   * @param {Cliente} item
   * @returns {any}
   *  */
  addItem(item: Cliente): Observable<any> {
    return this.http.post<Cliente>(`${this.baseUrl}createClient`, item, {
      headers: this.headers,
    });
  }

  addItemUser(item: CreateUser): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set(
        'access-control-allow-origin',
        'https://localhost:8074/DigitalSignatureRestApi/'
      )
      .set('Access-Control-Allow-Credentials', 'true')

    return this.http.post<any>(`${this.baseUrl}register`, item, {
      headers: headers,
    });
  }

  /**
   * Description: Service para registrar un nuevo cliente
   * @param {Cliente} item
   * @returns {any}
   *  */
  addCuentaBancariaToClient(item: DatoBancario): Observable<any> {
    return this.http.post<DatoBancario>(
      `${this.baseUrl}createCuentaBancaria`,
      item,
      {
        headers: this.headers,
      }
    );
  }

  /**
   * Description: Service para registrar un nuevo cliente
   * @param {Cliente} item
   * @returns {any}
   *  */
  asociarCuentaBancariaToClient(item: DatoBancarioCliente): Observable<any> {
    return this.http.post<DatoBancarioCliente>(
      `${this.baseUrl}asignarDatoBancarioToClient/${item.clientId}/${item.datoBancarioId}`,
      item,
      {
        headers: this.headers,
      }
    );
  }

  /**
   * Description: Service para registrar un nuevo cliente
   * @param {Cliente} item
   * @returns {any}
   *  */
  updateItem(item: Cliente): Observable<any> {
    return this.http.put<Cliente>(
      `${this.baseUrl}updateClient/${item.id}`,
      item,
      {
        headers: this.headers,
      }
    );
  }

  assignClientToCertificate(item: ClientCertificateDto): Observable<any> {
    return this.http.post<ClientCertificateDto>(`${this.baseUrl}asignarCertificateToClient`, item, { headers: this.headers });
  }

}
