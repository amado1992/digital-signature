import { Injectable, OnInit } from '@angular/core';
import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, catchError, map, of, shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import {
  CertificateInfo,
  clienteCertificadosAsociacion,
  Plan,
  planClienteAsociacion,
  planClienteCertificadoAsociacion,
} from '../interfaces/plan';
import Swal from 'sweetalert2';
import {
  commonConfig,
  handlerResponseError,
} from 'src/app/utils/common-configs';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  token = localStorage.getItem('token');

  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${this.token}`);

  boundary: number = 0;
  headersMultipart = new HttpHeaders().set(
    'Authorization',
    `Bearer ${this.token}`
  );

  private baseUrl: string = environment.api;

  public items$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public itemsTiposPago$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );
  public itemsMonedas$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public itemsClientes$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );

  constructor(private http: HttpClient) {}

  /**
   * Description
   * @returns {any}
   *  */
  fetchList() {
    this.http
      .get<any[]>(`${this.baseUrl}listPlan`, {
        headers: this.headers,
      })
      .pipe(
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
   * Description
   * @returns {any}
   *  */
  fetchListAsObservable() {
    return this.http.get<any[]>(`${this.baseUrl}listPlan`, {
      headers: this.headers,
    });
  }

  /**
   * Description
   * @returns {any}
   *  */
  fetchListObsevable(): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}listPlan`, {
      headers: this.headers,
    });
  }

  /**
   * Description: Function para listar los valores de pago
   * @returns {any}
   *  */
  fetchListTiposPago() {
    this.http
      .get<any[]>(`${this.baseUrl}listarTipoPago`, {
        headers: this.headers,
      })
      .pipe(
        shareReplay(1)
      )
      .subscribe(
        (receivedItems) => this.itemsTiposPago$.next(receivedItems),
        (err: HttpErrorResponse) => {
          handlerResponseError(err);
        }
      );
  }

  /**
   * Description: Function para obtener listado de monedas
   * @returns {any}
   *  */
  fetchListMonedas() {
    this.http
      .get<any[]>(`${this.baseUrl}listarMonedas`, {
        headers: this.headers,
      })
      .pipe(
        shareReplay(1)
      )
      .subscribe(
        (receivedItems) => this.itemsMonedas$.next(receivedItems),
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
   * Description
   * @param {Rol} item
   * @returns {any}
   *  */
  addItem(item: Plan) {
    const currentItems: Plan[] = this.getAll();
    this.http
      .post<Plan>(`${this.baseUrl}createPlan`, item, {
        headers: this.headers,
      })
      .subscribe({
        next: (data) => {
          console.log(data);
          currentItems.push(data);
          this.items$.next(currentItems);
          Swal.fire(
            {
              title: '¡Plan adicionado!',
              html: `El plan con identificador ${item.nombre} ha sido adicionado correctamente`,
              icon: 'success',
              confirmButtonText: 'Aceptar',
              ...commonConfig,
            }
          );
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
  deletedItem(item: Plan): Observable<any> {
    return this.http
      .post<Plan>(`${this.baseUrl}deletePlan/${item.id}`, item, {
        headers: this.headers,
      })
      .pipe(
        map((data: any) => {
          return data['success'] && data['success'] === true ? true : false;
        }),
        tap(
          (success) => {
            if (success) {
              this.deleteItemLocalService(item.id!);
            }
          },
          (err: HttpErrorResponse) => {
            handlerResponseError(err);
          }
        ), // when success, delete the item from the local service
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
  buscarPlanPorId(id: number): Observable<Plan> {
    return this.http
      .post<Plan>(`${this.baseUrl}getPlan/${id}`, id, {
        headers: this.headers,
      })
      .pipe(
        tap(
          (success) => {
            if (success) {
              console.log('Success');
            }
          },
          (err: HttpErrorResponse) => {
            handlerResponseError(err);
          }
        )
      );
  }

  /**
   * Description
   * @param {number} id
   * @returns {any}
   *  */
  deleteItemLocalService(id: number): boolean {
    const currentItems: Plan[] = this.getAll();
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

  /**
   * Description
   * @param {Rol} item
   * @returns {any}
   *  */
  updateItem(item: Plan): Observable<any> {
    return this.http.put<Plan>(`${this.baseUrl}updatePlan/${item.id}`, item, {
      headers: this.headers,
    });
  }

  updateItemLocalService(id: number, item: Plan): boolean {
    const currentItems: Plan[] = this.getAll();
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

  /**
   * Description
   * @param {clienteCertificadosAsociacion} item
   * @returns {any}
   *  */
  addCertificatesToClient(
    item: clienteCertificadosAsociacion
  ): Observable<any> {
    return this.http.post<Plan>(
      `${this.baseUrl}asignarCertificateToClient`,
      item,
      {
        headers: this.headers,
      }
    );
  }

  /**
   * Description
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

  /**
   * Description
   * @param {planClienteAsociacion} item
   * @returns {any}
   *  */
  addClientToPlan(
    item: planClienteAsociacion
  ): Observable<planClienteAsociacion> {
    return this.http.post<planClienteAsociacion>(
      `${this.baseUrl}asignarPlanToClient/${item.planId}/${item.clienteId}`,
      item,
      {
        headers: this.headers,
      }
    );
  }

  /**
   * Description
   * @param {FileList[]} item
   * @returns {any}
   *  */
  getCertificatesInfo(item: FileList): Observable<any> {

    let formData: FormData = new FormData();
    
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
   * Description: Obtiene un listado de entre otras cosas, certificados asignados a un cliente
   * @param {number} id
   * @returns {any}
   *  */
  getCertificatesClient(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}listarPlanesClientesId/${id}`, {
      headers: this.headers,
    });
  }

  getOnlyCertificatesClient(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}certificates/client/${id}`, {
      headers: this.headers,
    });
  }
}
