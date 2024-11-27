import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { planClienteCertificadoAsociacion } from 'src/app/plan/interfaces/plan';
import { handlerResponseError } from 'src/app/utils/common-configs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MisPlanesService {
  token = localStorage.getItem('token');
  public items$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public clientDetails$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public itemsClientes$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );

  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${this.token}`);

  boundary: number = 0;
  headersMultipart = new HttpHeaders().set(
    'Authorization',
    `Bearer ${this.token}`
  );

  private baseUrl: string = environment.api;

  /**
   * Description: Constructor de la clase
   * @param {HttpClient} privatehttp
   *  */
  constructor(private http: HttpClient) {}

  /**
   * Description: Function para obtener listado de planes por id de cliente
   * @returns {any}
   *  */
  fetchList(clientId: number) {
    this.http
      .get<any[]>(`${this.baseUrl}listarPlanesClientesId/${clientId}`, {
        headers: this.headers,
      })
      // .pipe(
      //   tap((x) => console.log('Planes por cliente', JSON.stringify(x))),
      //   shareReplay(1)
      // )
      .subscribe(
        (receivedItems) => this.items$.next(receivedItems),
        (err: HttpErrorResponse) => {
          handlerResponseError(err);
        }
      );
  }

  /**
   * Description: Function para obtener datos de un cliente por su id
   * @returns {any}
   *  */
  fetchClientData(clientId: number) {
    this.http
      .get<any[]>(`${this.baseUrl}client/${clientId}`, {
        headers: this.headers,
      })
      .pipe(
        tap((x) =>
          console.log(`Detalles cliente: ${clientId}`, JSON.stringify(x))
        ),
        shareReplay(1)
      )
      .subscribe(
        (receivedItems) => this.clientDetails$.next(receivedItems),
        (err: HttpErrorResponse) => {
          handlerResponseError(err);
        }
      );
  }

  /**
   * Description: Se obtienen todos los clientes que no estan asociados todavía al plan que se recibe como parámetro
   * @returns {any}
   *  */
  fetchListClientes(planId: number) {
    this.http
      .get<any[]>(`${this.baseUrl}listarClientesSinPlanes/${planId}`, {
        headers: this.headers,
      })
      .subscribe(
        (receivedItems) => this.itemsClientes$.next(receivedItems),
        (err: HttpErrorResponse) => {
          handlerResponseError(err);
        }
      );
  }

  /**
   * Description: Property to get all items
   * @returns {any}
   *  */
  get items(): Observable<any[]> {
    return this.items$.asObservable();
  }

  /**
   * Description
   * @returns {any}
   *  */
  getAll(): any[] {
    return this.items$.getValue();
  }

  /**
   * Description: Function para obtener información de certificados
   * @param {FileList[]} item
   * @returns {any}
   *  */
  getCertificatesInfo(item: FileList): Observable<any> {
    let formData: FormData = new FormData();
    // formData.append('files', item);
    for (let index = 0; index < item.length; index++) {
      const file = item[index];
      formData.append('files', file);
    }

    return this.http.post<any>(
      `${this.baseUrl}agregarIDCertificate`,
      formData,
      {
        headers: this.headersMultipart,
      }
    );
  }

  /**
   * Description:Function para crear asociación entre planes, clientes y certificados.
   * @param {planClienteCertificadoAsociacion} item
   * @returns {any}
   *  */
  crearAsociacion(
    item: planClienteCertificadoAsociacion
  ): Observable<planClienteCertificadoAsociacion> {
    return this.http.post<planClienteCertificadoAsociacion>(
      `${this.baseUrl}asignarCertificateToClientToCertificate/${item.planId}/${item.clientId}`,
      item,
      {
        headers: this.headers,
      }
    );
  }
}
