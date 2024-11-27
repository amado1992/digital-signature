import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, delay } from 'rxjs';

import { ApiAssignPermissionClient, ApiClient } from '../interfaces/api-client.interface';
import { getToken } from 'src/app/utils/common-configs';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService implements OnDestroy {
  // token!: string | null;
  token = localStorage.getItem('token');

  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('access-control-allow-origin', environment.api)
    .set('Access-Control-Allow-Credentials', 'true')
    .set('Authorization', `Bearer ${this.token}`);

  private baseUrl: string = environment.api;
  /**
   * Description: Constructor de la clase
   * @param {HttpClient} privatehttp
   *  */
  constructor(private http: HttpClient) {}

  /**
   * Description
   * @returns {any}
   *  */
  ngOnDestroy(): void {
    // this.token = 'asdasd';
  }

  /**
   * Description
   * @returns {any}
   *  */
  // getJWT(): string {
  //   try {
  //     this.token = localStorage.getItem('token')!;
  //   } catch (error) {
  //     throw error;
  //   }
  //   return this.token!;
  // }

  /**
   * Description Retorna Observable con Listado de Clientes
   * @returns {Observable<ApiClient[]>}
   *  */
  getListadoApiClients(): Observable<ApiClient[]> {
    // return this.http.get<ApiClient[]>(`${this.baseUrl}listApiClient`, {
    //   headers: this.headers,
    // });
    return this.http.get<ApiClient[]>(`${this.baseUrl}listApiClient`);
  }

  /**
   * Description: Function para eliminar un Api Client
   * @param {ApiClient} item: parámetro de tipo ApiClient
   * @returns {any}
   *  */
  deletedItem(item: ApiClient): Observable<any> {
    return this.http.post<ApiClient>(
      `${this.baseUrl}deleteApiClient/${item.id}`,
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
  addItem(item: ApiClient): Observable<any> {
    return this.http.post<ApiClient>(`${this.baseUrl}registerApiClient`, item, {
      headers: this.headers,
    });
    // return this.http.post<ApiClient>(`${this.baseUrl}registerApiClient`, item);
  }

  /**
   * Description
   * @param {ApiClient} item
   * @returns {any}
   *  */
  updateItem(item: ApiClient): Observable<any> {
    return this.http.put<ApiClient>(
      `${this.baseUrl}updateApiClient/${item.id}`,
      item
      // {
      //   headers: this.headers,
      // }
    );
  }

  asignPermission(item: ApiAssignPermissionClient): Observable<any> {
    return this.http.post<ApiClient>(`${this.baseUrl}assignPermissionToApiClient`, item, {
      headers: this.headers,
    });
  }
}
