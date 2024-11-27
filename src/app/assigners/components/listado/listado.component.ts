import {
  AfterViewInit,
  Component,
  OnInit,
  Pipe,
  PipeTransform,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { AssignersService } from '../../services/assigners.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { delay } from 'rxjs/internal/operators/delay';
import { HttpErrorResponse } from '@angular/common/http';
import { LoremIpsum } from 'lorem-ipsum';
import { MatTableDataSource } from '@angular/material/table';
import { Permiso } from '../../interfaces/assigners.interface';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import {
  esRangeLabel,
  handlerResponseError,
} from 'src/app/utils/common-configs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BehaviorSubject, Observable, tap, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {
  Column,
  TableColumn,
} from 'src/app/shared/components/mat-reusable-table/mat-reusable-table.interface';
import { MatSort, Sort } from '@angular/material/sort';

// @Pipe({
//   name: 'FilterData',
// })
// export class OrdinalPipe implements PipeTransform {
//   transform(value: number): string {
//     var data = ELEMENT_DATA_TITLE.filter(
//       (element:any) => element.position === value
//     );
//     return data[0].name;
//   }
// }

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss'],
})
export class ListadoComponent implements OnInit, AfterViewInit {

  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  //dataSource: MatTableDataSource<any> = new MatTableDataSource<any>()
  dataSourcePermisos = new MatTableDataSource<Permiso>();
  displayedColumns = ['nombre', 'operationType', 'avaliable', 'descripcion'];
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  filter: string = "";
  searchIcon: string = "";
  clearIconColor: string = "";
  isLoadingResults: boolean = true;
  order?: Sort;

  //initiate the new Loading variable via BehaviorSubject and set it to "false" from the beginning.
  public loading$ = new BehaviorSubject<boolean>(false);

  //@ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  anotherTableColumns: Array<Column> = [
    {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (element: Record<string, any>) => `${element['nombre']}`,
    },
    {
      columnDef: 'ruta',
      header: 'Ruta',
      cell: (element: Record<string, any>) => `${element['operationType']}`,
    },
    {
      columnDef: 'estado',
      header: 'Estado',
      cell: (element: Record<string, any>) => `${element['avaliable']}`,
    },
    {
      columnDef: 'descripcion',
      header: 'Descripción',
      cell: (element: Record<string, any>) => `${element['descripcion']}`,
    },
  ];

  orders!: Permiso[];
  ordersTableColumns!: TableColumn[];

  // headArray = [
  //   { nameCol: 'nombre', nameDisplayName: 'Nombre', dataValue: '' },
  //   { nameCol: 'ruta', nameDisplayName: 'Ruta', dataValue: '' },
  //   { nameCol: 'estado', nameDisplayName: 'Estado', dataValue: '' },
  //   { nameCol: 'descripción', nameDisplayName: 'Descripcion', dataValue: '' },
  // ];
  
  //dataSourcePermisos = new MatTableDataSource<Permiso>();
  // dataSourcePermisos = [];
  displayedColumnsPlan: string[] = ['nombre', 'ruta', 'estado', 'descripcion'];
  isLoading: Subject<boolean> = this.loader.isLoading;
  permisosList!: any[];
  errorResponse!: HttpErrorResponse;

  p: number = 1;
  searchText = '';

  myData: any;
  myColumns: any;

  /**
   * Description: Get loading observable object
   * @returns {any}
   *  */
  getLoading(): Observable<boolean> {
    return this.loading$;
  }

  // callback(): void {
  //   console.log('Function');
  // }

  // public boundedPrintValue() {
  //   console.log('this.name');
  // }

  /**
   * Description
   * @param {AssignersService} permisosService
   * @param {LoadingService} loader
   *  */
  constructor(
    readonly permisosService: AssignersService,
    private loader: LoadingService,
    public _MatPaginatorIntl: MatPaginatorIntl,
    private router: Router,
    private authService: AuthService
  ) {}

  removeOrder(order: any) {
    console.log(order);
  }

  /**
   * Description
   * @returns {any}
   *  */
  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSourcePermisos.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSourcePermisos.sort = this.sort;
    }
  }

  /**
   * Description: Verifica si el usuario se encuentra logueado, en caso contrario se redirecciona hacia el login
   * @returns {any}
   *  */
  private isAuthenticatedUser() {
    this.authService.getIsLogged().pipe(
      tap((res) => {
        if (!res) {
          this.router.navigate(['/login']);
          return;
        }
      })
    );
  }

  /**
   * Description: Function para initializar columnas del listado de Permisos
   * @returns {any}
   *  */
  private initializeColumns(): void {
    this.ordersTableColumns = [
      {
        name: 'Nombre',
        dataKey: 'nombre',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Ruta',
        dataKey: 'operationType',
        position: 'left',
        isSortable: false,
      },
      {
        name: 'Estado',
        dataKey: 'avaliable',
        position: 'left',
        isSortable: true,
        isBooleable: true,
      },
      {
        name: 'Descripción',
        dataKey: 'descripcion',
        position: 'left',
        isSortable: false,
      },
    ];
  }

  /**
   * Description: Function para asignar la salida del componente filter-box a la property this.searchText.
   * @param {string} term
   * @returns {any}
   *  */
  keyupHandler(term: string): void {
    // const filterValue = (event.target as HTMLInputElement).value;
    // console.log(term);
    this.searchText = term;
  }

  // sortData(sortParameters: Sort) {
  //   const keyName = sortParameters.active;
  //   if (sortParameters.direction === 'asc') {
  //     this.orders = this.orders.sort((a: Order, b: Order) =>
  //       a[keyName].localeCompare(b[keyName])
  //     );
  //   } else if (sortParameters.direction === 'desc') {
  //     this.orders = this.orders.sort((a: Order, b: Order) =>
  //       b[keyName].localeCompare(a[keyName])
  //     );
  //   } else {
  //     return (this.orders = this.getOrders());
  //   }
  // }

  ngOnInit(): void {
    this.order = { active: "", direction: "" };
    this.filter = "";
    this.searchIcon = "search";
    this.clearIconColor = "";

    this.initializeColumns();
    // this.orders = this.getOrders();
    this.isAuthenticatedUser();
     this._MatPaginatorIntl.firstPageLabel = 'Primera página';
     this._MatPaginatorIntl.itemsPerPageLabel = 'Permisos por página:';
     this._MatPaginatorIntl.lastPageLabel = 'Ultima página';
     this._MatPaginatorIntl.nextPageLabel = 'Página siguiente';
     this._MatPaginatorIntl.previousPageLabel = 'Página anterior';
     this._MatPaginatorIntl.getRangeLabel = esRangeLabel;
    this.permisosService.fetchListPermisos();
    // this.dataSourcePermisos = new MatTableDataSource<Permiso>(
    //   this.permisosService.itemsPermisos
    // );
    
    /*this.permisosService.itemsPermisos.subscribe(
      (data) => {
        // this.loading$.next(true);
        let dataWithoutIdColumn = data.map((el) => ({
          avaliable: el.avaliable,
          descripcion: el.descripcion,
          nombre: el.nombre,
          operationType: el.operationType,
        }));
        this.dataSourcePermisos.data = dataWithoutIdColumn;
        this.orders = dataWithoutIdColumn;
        if (this.dataSourcePermisos.data.length > 0){
        this.isLoadingResults = false;
        }
        setTimeout(() => {
          if (this.paginator != undefined) {
            this.dataSourcePermisos.paginator = this.paginator
          }
        });
      },
      (err: HttpErrorResponse) => {
        handlerResponseError(err);
      });*/

      this.permisosService.itemsPermisos.subscribe({
        next: (data) => {
          let dataWithoutIdColumn = data.map((el) => ({
            avaliable: el.avaliable,
            descripcion: el.descripcion,
            nombre: el.nombre,
            operationType: el.operationType,
          }));
          this.dataSourcePermisos.data = dataWithoutIdColumn;
          this.orders = dataWithoutIdColumn;
          if (this.dataSourcePermisos.data.length > 0){
          this.isLoadingResults = false;
          }
          setTimeout(() => {
            if (this.paginator != undefined) {
              this.dataSourcePermisos.paginator = this.paginator
            }
          });
        },
        error: (e) => {
          console.error(e)
          handlerResponseError(e)
        },
        complete: () => console.info('complete')
      })
  }

  // private createFilter(): (contact: Permiso, filter: string) => boolean {
  //   let filterFunction = function (contact: Permiso, filter: any): boolean {
  //     let searchTerms = JSON.parse(filter);

  //     return contact.avaliable !== -1;
  //   };

  //   return filterFunction;
  // }

  nestedFilterCheck(search: any, data: any, key: any) {
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.nestedFilterCheck(search, data[key], k);
        }
      }
    } else {
      search += data[key];
    }
    return search;
  }

  /**
   * Description
   * @param {Event} event
   * @returns {any}
   *  */
  /*applyFilter(event: Event) {
    console.log(this.searchText);
    let filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSourcePermisos.filter = filterValue;
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSourceCertificados.filter = filterValue.trim().toLowerCase();

    if (this.dataSourcePermisos.paginator) {
      this.dataSourcePermisos.paginator.firstPage();
    }
  }*/

  getListadoPermisos(): string[] {
    // this.permisosList = [
    //   {
    //     id: 'VC',
    //     nombreCorto: 'validateCertificate',
    //     nombreLargo: 'Validar certificado',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'VS',
    //     nombreCorto: 'validateSignature',
    //     nombreLargo: 'Validar firma digital',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'CCS',
    //     nombreCorto: 'checkCertificateStatus',
    //     nombreLargo: 'Verificar estado de certificado digital',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'UAT',
    //     nombreCorto: 'updateApiClientToken',
    //     nombreLargo: 'Actualizar token de Cliente Api',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'TC',
    //     nombreCorto: 'testCall',
    //     nombreLargo: 'Test Call',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'SF',
    //     nombreCorto: 'signFile',
    //     nombreLargo: 'Firmar fichero',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'VCJ',
    //     nombreCorto: 'validateCertificateJSON',
    //     nombreLargo: 'Validar Certificado en formato JSON',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'VDJ',
    //     nombreCorto: 'validateDocumentJSON',
    //     nombreLargo: 'Validar Documento en formato JSON',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'UP',
    //     nombreCorto: 'updatePassword',
    //     nombreLargo: 'Actualizar contraseña',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'APR',
    //     nombreCorto: 'assignPermissionToRole',
    //     nombreLargo: 'Asignar permisos a rol',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'APA',
    //     nombreCorto: 'assignPermissionToApiClient',
    //     nombreLargo: 'Asignar permisos a cliente API',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'ARU',
    //     nombreCorto: 'assignRolesToUser',
    //     nombreLargo: 'Asignar roles a usuario',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'UAC',
    //     nombreCorto: 'updateApiClient',
    //     nombreLargo: 'Actualizar Cliente API',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'DAC',
    //     nombreCorto: 'deleteApiClient',
    //     nombreLargo: 'Eliminar Cliente API',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'LAC',
    //     nombreCorto: 'listApiClient',
    //     nombreLargo: 'Listar Clientes API',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'AC',
    //     nombreCorto: 'apiClient',
    //     nombreLargo: 'Cliente API',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'MDU',
    //     nombreCorto: 'myDatesUser',
    //     nombreLargo: 'Mis datos de usuario',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'CC',
    //     nombreCorto: 'createClient',
    //     nombreLargo: 'Crear cliente',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'DC',
    //     nombreCorto: 'deleteClient',
    //     nombreLargo: 'Eliminar Cliente API',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'UC',
    //     nombreCorto: 'updateClient',
    //     nombreLargo: 'Actualizar Cliente API',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'C',
    //     nombreCorto: 'client',
    //     nombreLargo: 'Cliente',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'LC',
    //     nombreCorto: 'listClient',
    //     nombreLargo: 'Listar Clientes',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'UMD',
    //     nombreCorto: 'updateMyDates',
    //     nombreLargo: 'Actualizar mis datos',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'UIM',
    //     nombreCorto: 'updateInUseMyDates',
    //     nombreLargo: 'Actualizar mis datos en uso?',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'GU',
    //     nombreCorto: 'getUser',
    //     nombreLargo: 'Obtener usuario',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'LU',
    //     nombreCorto: 'listUser',
    //     nombreLargo: 'Listar usuarios',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'R',
    //     nombreCorto: 'role',
    //     nombreLargo: 'Roles',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'LR',
    //     nombreCorto: 'listRoles',
    //     nombreLargo: 'Listar roles',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'DR',
    //     nombreCorto: 'deleteRole',
    //     nombreLargo: 'Eliminar roles',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'UR',
    //     nombreCorto: 'updateRole',
    //     nombreLargo: 'actualizar roles',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'CR',
    //     nombreCorto: 'createRole',
    //     nombreLargo: 'Crear rol',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    //   {
    //     id: 'DU',
    //     nombreCorto: 'deleteUser',
    //     nombreLargo: 'Eliminar usuario',
    //     descripcion: this.lorem.generateSentences(5),
    //   },
    // ];

    return this.permisosList;
  }

  clearFilter() {
    this.filter = "";
  }

  updateIconColor() {
    this.clearIconColor = this.clearIconColor == "" ? "primary" : "";
  }

  sortData(sort: Sort) {
    if (this.order){
    this.order.active = sort.active;
    this.order.direction = sort.direction;
    }
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSourcePermisos.filter = filterValue.trim().toLowerCase();

  if (this.dataSourcePermisos.paginator) {
    this.dataSourcePermisos.paginator.firstPage();
  }
}
}
