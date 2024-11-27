//https://material.angular.io/cdk/clipboard/api
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { delay } from 'rxjs/internal/operators/delay';
import { Subject } from 'rxjs/internal/Subject';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ApiAssignPermissionClient, ApiClient } from '../../interfaces/api-client.interface';
import { ApiClientService } from '../../services/api-client.service';

import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  FormControl,
} from '@angular/forms';
import { tap, Timestamp } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ElementRef } from '@angular/core';
import { TokenMessageComponent } from '../../../shared/components/token-message/token-message.component';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { HtmlParser } from '@angular/compiler/public_api';
import * as moment from 'moment';
import { dateValidator } from '../../../utils/date-range.validators';
import {
  commonConfig,
  esRangeLabel,
  handlerResponseError,
  randomString,
  sha256,
} from 'src/app/utils/common-configs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TableColumn } from 'src/app/shared/components/mat-reusable-table/mat-reusable-table.interface';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AssignersService } from 'src/app/assigners/services/assigners.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

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

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>()
  displayedColumns = ['name', 'begin_date', 'end_date', 'enabled', 'description', 'actions'];
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  filter: string = "";
  searchIcon: string = "";
  clearIconColor: string = "";
  isLoadingResults: boolean = false;
  order?: Sort;
  
  dropdownList: any = [];
  selectedItems: any = [];
  selectedItemsModel: any = [];
  dropdownSettings: IDropdownSettings = {};
  idApiClient: any = 0

  //https://bitbucket.org/techbriel/disable_past-dates-in-datepicker/src/master/src/app/app.component.ts
  //How to disable Past dates in a datepicker | Angular mat datepicker, | input field type date
  currentDate!: any;
  fechaBajaLimite!: any;
  ordinaryDateSelected!: Date;
  toggleSearch: boolean = false;
  //variable para setear en el form de create/update el valor del día actual + 1
  currentDatePlusOneDay: Date = new Date();
  @ViewChild('searchbar') searchbar!: ElementRef;

  idFieldErrorMsg: string = 'Teclee un identificador válido ';
  dataTokenComponent: string[] = [];
  isLoading: Subject<boolean> = this.loader.isLoading;
  ApiClientList!: any[];
  errorResponse!: HttpErrorResponse;
  //Referencia al modal del create/update item
  modalRef?: BsModalRef;
  _instance!: BsModalService;
  isChecked: boolean = false;

  fromDate: any;
  toDate: any;

  form!: FormGroup;
  submitted = false;

  p: number = 1;
  searchText = '';

  clientesApiTableColumns!: TableColumn[];

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  //referencia al modal del token de api client
  // @ViewChild('token', { static: false }) tokenModal!: ElementRef;
  @ViewChild('template')
  private template!: TemplateRef<any>;

  commonConfig: any = {
    border: '3px solid white',
    allowOutsideClick: false,
    allowEscapeKey: false,
    // showClass: {
    //   popup: 'animate__animated animate__fadeIn animate__faster',
    // },
    // hideClass: {
    //   popup: 'animate__animated animate__fadeIn animate__faster',
    // },
  };

  /**
   * Description
   * @param {BsModalService} privatemodalService
   * @param {FormBuilder} privatefb
   * @param {ApiClientService} privateapiClienService
   * @param {any} privateloader:LoadingService//privatemodalService:BsModalService
   *  */
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private apiClienService: ApiClientService,
    private loader: LoadingService, // private modalService: BsModalService
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    readonly service: AssignersService,
    public _MatPaginatorIntl: MatPaginatorIntl,
  ) {
    // this.currentDate = this.datePipe.transform(new Date(), 'MM-dd-yyyy');
    // console.log(Date.parse(new Date().toString()));
  }

  dropdownInit(): void {

    this.service.itemsPermisos$.subscribe(
      (data) => {
        console.log("My data www ", data)
        if (data) {
          this.dropdownList = data.map((el) => ({
            id: el.id,
            text: el.nombre,
          }));
        }
      },
      (err: HttpErrorResponse) => {
        handlerResponseError(err);
      }
    );
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'text',
      selectAllText: 'Marcar todos',
      unSelectAllText: 'Desmarcar todos',
      allowSearchFilter: true,
    };
  }

  /**
   * Description: Function para initializar columnas del listado de clientes API
   * @returns {any}
   *  */
  private initializeColumns(): void {
    this.clientesApiTableColumns = [
      // {
      //   name: 'Identificador',
      //   dataKey: 'identifier',
      //   position: 'left',
      //   isSortable: true,
      // },
      {
        name: 'Nombre',
        dataKey: 'name',
        position: 'left',
        isSortable: false,
      },
      {
        name: 'Fecha de alta',
        dataKey: 'begin_date',
        position: 'left',
        isDate: true,
        isSortable: false,
      },
      {
        name: 'Fecha de baja',
        dataKey: 'end_date',
        position: 'left',
        isDate: true,
        isSortable: true,
      },
      {
        name: 'Estado',
        dataKey: 'enabled',
        position: 'left',
        isSortable: false,
        isBooleable: true,
      },
      {
        name: 'Observaciones',
        dataKey: 'description',
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

  openSearch() {
    this.toggleSearch = true;
    this.searchbar.nativeElement.focus();
  }

  searchClose() {
    this.searchText = '';
    this.toggleSearch = false;
  }

  get date() {
    return this.form.get('fechaAlta');
  }

  // convenience getter for easy access to form fields
  //https://stackblitz.com/edit/angular-reactive-forms-date-validation?file=src%2Fapp%2Fapp.component.ts
  get f() {
    return this.form.controls;
  }

  /**
   * Description
   * @param {string[]} msg
   * @returns {any}
   *  */
  openSnackBar(msg: string[]) {
    this._snackBar.openFromComponent(TokenMessageComponent, {
      data: msg,
      // panelClass: ['blue-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  /**
   * Description
   * @returns {any}
   *  */
  ngOnInit(): void {
    this.order = { active: "", direction: "" };
    this.filter = "";
    this.searchIcon = "search";
    this.clearIconColor = "";

    this._MatPaginatorIntl.firstPageLabel = 'Primera página';
    this._MatPaginatorIntl.itemsPerPageLabel = 'Clientes api por página:';
    this._MatPaginatorIntl.lastPageLabel = 'Ultima página';
    this._MatPaginatorIntl.nextPageLabel = 'Página siguiente';
    this._MatPaginatorIntl.previousPageLabel = 'Página anterior';
    this._MatPaginatorIntl.getRangeLabel = esRangeLabel;

    this.service.fetchListPermisos();
    console.log(this.service.items$.value);

    this.initializeColumns();
    this.currentDate = new Date().toISOString().slice(0, 10);
    this.fechaBajaLimite = new Date().toISOString().slice(0, 10);
    // console.log(this.currentDate);
    this.isAuthenticatedUser();
    this.ListadoClientesApi();
    // add a day
    this.currentDatePlusOneDay.setDate(
      this.currentDatePlusOneDay.getDate() + 1
    );
    /* Construir el FormGroup(productForm), se usa el FormBuilder para facilitar la construccion del formulario(setear valores y validadores) */
    this.FormGroupInit();

    this.dropdownInit();
  }

  ngAfterViewInit() {
    
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  /**
   * Description
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
   * Description: Se obtiene listado de clientes API
   * @returns {any}
   *  */
  private ListadoClientesApi() {
    this.isLoadingResults = true
    this.apiClienService.getListadoApiClients().subscribe(
      (resp) => {
        this.isLoadingResults = false
        //Solucionamos el problema con los campos fecha alta y baja, que no se mostraban adecuadamente en el componente 'app-mat-reutilizable-table'
        this.ApiClientList = resp.map((item: ApiClient) => ({
          id: item.id,
          created: item.created,
          enabled: item.enabled,
          end_date: this.datePipe.transform(item.end_date, 'yyyy-MM-dd'),
          begin_date: this.datePipe.transform(item.begin_date, 'yyyy-MM-dd'),
          identifier: item.identifier,
          description: item.description,
          name: item.name,
          operationType: item.operationType
        }));
        this.dataSource.data = this.ApiClientList
      },
      (err: HttpErrorResponse) => {
        handlerResponseError(err);
        this.isLoadingResults = false
      }
    );
  }

  /**
   * Description Evento checked change del select País
   * @param {any} e
   * @returns {any}
   *  */
  onNativeChange(e: any) {
    this.isChecked = e.target.checked;
  }

  // get f() {
  //   return this.form.controls;
  // }

  /**
   * Description: Function para inicializar el FormBuilder
   * @returns {any}
   *  */
  private FormGroupInit(): void {
    this.form = this.fb.group({
      id: [], //Estaba inicializado como [''] y asi tenía valor empty pero tenía
      // id: [''],
      identificador: [
        // '',
        // [
        //   Validators.required,
        //   Validators.minLength(1),
        //   Validators.pattern(/^[a-zA-ZñÑ,]+$/), //Solo letras
        // ],
      ],
      // fechaAlta: new FormControl(new Date(), Validators.required),
      fechaAlta: [
        this.datePipe.transform(this.currentDatePlusOneDay, 'yyyy-MM-dd'),
        [
          Validators.required,
          Validators.pattern(
            /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
          ),
          this.dateRangeValidator,
          dateValidator(),
        ],
      ],
      fechaBaja: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
          ),
          this.dateRangeValidator,
        ],
      ],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern(/^[a-zA-ZñÑ.\s]*$/), //letras y espacios
        ],
      ],
      descripcion: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern(
            /^[©a-zA-ZñÑ0-9\u0900-\u097f,\.\s\-\'\"!?\(\)\[\]]+$/
          ), //https://stackoverflow.com/questions/42082681/regex-validation-for-description-box#:~:text=Things%20allowed%3A%20alphabets%2C%20special%20characters%2C%20spaces%2C%20new%20line,this%20%5E%20%28.%7Cs%29%2A%20%5Ba-zA-Z%5D%2B%20%28.%7Cs%29%2A%24%20should%20help%20you
          //https://stackoverflow.com/questions/52564859/regex-validation-for-memo-field-client-and-server-side-with-few-special-tags
        ],
      ],
      estado: [''],
      created: [''],
      access_token: [''],
    });
  }

  /**
   * Description: Validar campos de fecha, fecha de inicio y fecha fin
   * @returns {any}
   *  */
  private dateRangeValidator: ValidatorFn = (): {
    [key: string]: any;
  } | null => {
    let invalid = false;
    const from = this.form && this.form.get('fechaAlta')!.value;
    const to = this.form && this.form.get('fechaBaja')!.value;
    if (from && to) {
      invalid = new Date(from).valueOf() > new Date(to).valueOf();
    }
    return invalid ? { invalidRange: { from, to } } : null;
  };

  //https://stackoverflow.com/questions/61503538/custom-validator-for-date-before-in-angular
  dateValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value) {
      const date = moment(control.value);
      const today = moment();
      if (date.isBefore(today)) {
        return { invalidDate: true };
      }
    }
    return null!;
  }

  /**
   * Description Function para eliminar clientes api
   * @param {number} index: id del cliente api a eliminar
   * @returns {any}
   * 5 */
  deletedItem(item: ApiClient): void {
    Swal.fire({
      title: `¿Está seguro de eliminar el Cliente API: ${item.name}?`,
      text: `Este proceso es irreversible, preste mucha atención.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'No, cancelar esta acción',
    }).then((result) => {
      if (result.value) {
        //TODO: incluir llamada a lógica del service correspondiente para eliminar lógicamente este item
        //TODO: y dentro del suscribe, manejamos el tipo de mensaje a retornar
        this.apiClienService.deletedItem(item).subscribe(
          (resp) => {
            this.ListadoClientesApi();
            Swal.fire(
              // 'Eliminado!',
              // `El Cliente API con identificador ${item.identifier} ha sido eliminado correctamente`,
              // 'success'
              {
                title: '¡Eliminado!',
                html: `El Cliente API ${item.name} ha sido eliminado correctamente`,
                icon: 'success',
                confirmButtonText: 'Aceptar',
                ...commonConfig,
              }
            );
          },
          (error) => {
            Swal.fire({
              // title: 'Error eliminando cliente api!',
              // text: 'Ha ocurrido el siguiente error ${error}',
              // ...this.commonConfig,

              title: '¡Error eliminando cliente api!',
              html: `Ha ocurrido el siguiente error ${error}`,
              icon: 'error',
              confirmButtonText: 'Aceptar',
              ...commonConfig,
            });
          }
        );
        // Swal.fire(
        //   // 'Eliminado!',
        //   // `El Cliente API con identificador ${item.identifier} ha sido eliminado correctamente`,
        //   // 'success'
        //   {
        //     title: '¡Eliminado!',
        //     html: `El Cliente API ${item.identifier} ha sido eliminado correctamente`,
        //     icon: 'success',
        //     confirmButtonText: 'Aceptar',
        //     ...commonConfig,
        //   }
        // );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
      }
    });
  }

  /**
   * Description: Abre el modal correspondiente para mostrar al usuario el token que retorna el endpoint de crear cliente API
   * @param {TemplateRef<any>} template
   * @returns {any}
   *  */
  openModalTokenApiClient(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  /**
   * Description: Abre el modal correspondiente a las acciones de create/update Cliente API
   * @param {TemplateRef<any>} template
   * @param {ApiClient} client?
   * @returns {any}
   *  */
  openModal(template: TemplateRef<any>, client?: ApiClient) {
    if (client !== undefined) {
      // console.log(JSON.stringify(client));
      // updates form values if there is a user
      // var dateFormat = new Date(client.begin_date!);
      console.log(client.end_date);
      //Se setea el valor de los campos fecha alta/fecha baja en sus respectivos controles
      // this.fromDate = this.datePipe.transform(client.begin_date, 'yyyy-dd-MM'); //fecha alta
      // this.toDate = this.datePipe.transform(client.end_date, 'yyyy-dd-MM'); //fecha baja

      this.form.controls['identificador'].disable();
      this.form.controls['fechaAlta'].disable();

      // this.form.controls['fechaBaja'].setValue(this.toDate);
      this.form.patchValue({
        id: client.id,
        identificador: client.identifier,
        fechaAlta: this.datePipe.transform(client.begin_date, 'yyyy-MM-dd'),
        fechaBaja: this.datePipe.transform(client.end_date, 'yyyy-MM-dd'),
        nombre: client.name,
        descripcion: client.description,
        estado: client.enabled,
        created: client.created,
        access_token: client.access_token,
      });
    } else {
      // clears the form if there is no user
      // this.form.setValue({
      //   id: 1,
      //   fechaAlta: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      // });
      // this.form.patchValue({
      //   fechaAlta: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      // });
      this.form.controls['identificador'].enable();
      this.form.controls['fechaAlta'].enable();
      this.form.reset(); //reseteamos los posibles valores adicionados en el update form
      this.fromDate = '';
      this.toDate = '';
      this.FormGroupInit(); //Iniciamos nuevamente el form de API Cliente para inicializar los valores deseados, como ocurreo con el campo Fecha Alta
    }
    // console.log(this.form.value.name);
    this.modalRef = this.modalService.show(template, {
      ignoreBackdropClick: true,
      keyboard: false,
      // class: 'modal-dialog-centered modal-dialog-scrollable',
      // class: 'modal-dialog-scrollable',
    });
    this.modalRef.onHide!.subscribe((reason: string | any) => {
      // this.form.reset();
    });
  }

  /**
   * Description: Salvar los cambios en BD, sea una acción de adición o edición.
   * @returns {any}
   *  */
  SaveChages(): void {
    this.submitted = true;
    console.log(this.form.value.id);
    if (this.form.value.id !== null) {
      //TODO: Implementar mecanismo para lógica de update
      // console.log('update');
      this.updateApiClient();
    } else {
      if (this.form.valid) {
        //  this.addUser();
        // console.log('create');
        this.addApiClient();
      }
    }
    this.ListadoClientesApi();
  }

  valuechange(newValue: any) {
    this.fechaBajaLimite = newValue;
    // this.fechaBajaLimite = this.fechaBajaLimite.toISOString().slice(0, 10);
    console.log(newValue);
  }

  handler(value: any) {
    console.log(value);
    // console.log('year', value.getFullYear());
    // console.log('month', value.getMonth() + 1);
    // console.log('day', value.getDate());
  }

  /**
   * Description: Adiciona un item de tipo API Client.
   * @returns {any}
   *  */
  private addApiClient(): void {
    const apiClient: ApiClient = {
      identifier: randomString(40),
      // identifier: this.form.value.identificador,
      begin_date: Date.parse(this.form.value.fechaAlta),
      end_date: Date.parse(this.form.value.fechaBaja),
      name: this.form.value.nombre,
      description: this.form.value.descripcion,
      // enabled: this.form.value.estado,
      enabled: this.isChecked ? true : false,
    } as ApiClient;

    // console.log(apiClient);

    this.apiClienService.addItem(apiClient).subscribe(
      (resp) => {
        this.dataTokenComponent.push(resp.token);
        this.dataTokenComponent.push(apiClient.identifier);
        //Abrimos el componente snackbar
        this.openSnackBar(this.dataTokenComponent);
        this.ListadoClientesApi();
      },
      (err: HttpErrorResponse) => {
        handlerResponseError(err);
      }
    );
    this.modalRef?.hide();

    //Version 2
    // let name = this.form.value.nombre;
    // sha256(name).then((hex) => {
    //   const apiClient: ApiClient = {
    //     identifier: hex,
    //     // identifier: this.form.value.identificador,
    //     begin_date: Date.parse(this.form.value.fechaAlta),
    //     end_date: Date.parse(this.form.value.fechaBaja),
    //     name: this.form.value.nombre,
    //     description: this.form.value.descripcion,
    //     // enabled: this.form.value.estado,
    //     enabled: this.isChecked ? true : false,
    //   } as ApiClient;

    //   this.apiClienService.addItem(apiClient).subscribe(
    //     (resp) => {
    //       this.dataTokenComponent.push(resp.token);
    //       this.dataTokenComponent.push(apiClient.identifier);
    //       //Abrimos el componente snackbar
    //       this.openSnackBar(this.dataTokenComponent);
    //       this.ListadoClientesApi();
    //     },
    //     (err: HttpErrorResponse) => {
    //       handlerResponseError(err);
    //     }
    //   );
    //   this.modalRef?.hide();
    // });

    //version 1
    // const apiClient: ApiClient = {
    //   identifier: this.form.value.identificador,
    //   begin_date: Date.parse(this.form.value.fechaAlta),
    //   end_date: Date.parse(this.form.value.fechaBaja),
    //   // begin_date: 1675728000000,
    //   // end_date: 1893369600000,
    //   name: this.form.value.nombre,
    //   description: this.form.value.descripcion,
    //   // enabled: this.form.value.estado,
    //   enabled: this.isChecked ? true : false,
    // } as ApiClient;

    // console.log(apiClient);

    // this.apiClienService.addItem(apiClient).subscribe(
    //   (resp) => {
    //     this.dataTokenComponent.push(resp.token);
    //     this.dataTokenComponent.push(apiClient.identifier);
    //     //Abrimos el componente snackbar
    //     this.openSnackBar(this.dataTokenComponent);
    //     this.ListadoClientesApi();
    //   },
    //   (err: HttpErrorResponse) => {
    //     handlerResponseError(err);
    //   }
    // );
    // this.modalRef?.hide();
  }

  /**
   * Description Actualiza un item de tipo API Client.
   * @returns {any}
   *  */
  private updateApiClient(): void {
    const apiClient: ApiClient = {
      id: this.form.value.id,
      identifier: this.form.controls['identificador'].value,
      begin_date: Date.parse(this.form.controls['fechaAlta'].value), //disabled control
      end_date: Date.parse(this.form.value.fechaBaja),
      // begin_date: 1675728000000,
      // end_date: 1893369600000,
      name: this.form.value.nombre,
      description: this.form.value.descripcion,
      // enabled: this.form.value.estado,
      enabled: this.isChecked ? true : false,
      created: this.form.value.created,
      access_token: this.form.value.access_token!,
    } as ApiClient;

    // console.log(JSON.stringify(apiClient));
    this.apiClienService.updateItem(apiClient).subscribe(
      (resp) => {
        resp.data = this.ApiClientList;
        // console.log(resp.message);
        this.ListadoClientesApi();
        Swal.fire(
          // 'Cliente API modificado!',
          // `El Cliente API con identificador ${apiClient.name} ha sido modificado correctamente`,
          // 'success'
          {
            title: '¡Cliente API modificado!',
            html: `El Cliente API ${apiClient.name} ha sido modificado correctamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            ...commonConfig,
          }
        );
      },
      (err: HttpErrorResponse) => {
        handlerResponseError(err);
      }
    );
    this.modalRef?.hide();
  }

  /**
   * Description: Function para verificar disponibilidad de identificador tecleado por el usuario
   * @param {Event} event
   * @returns {any}
   *  */
  checkIdAvailability(event: Event) {
    let id = (event.target as HTMLInputElement).value;
    let result = this.ApiClientList.filter(
      (item: ApiClient) => item.identifier === id
    );
    // console.log(result.length);
    if (result.length === 1) {
      this.form.controls['identificador'].setErrors({ incorrect: true });
      this.idFieldErrorMsg = `El identificador <strong>${id}</strong> ha sido especificado previamente en otro cliente API. Por favor, especifique uno diferente.`;
    } else {
      this.idFieldErrorMsg = 'Teclee un identificador válido ';
    }
  }


  asignPemisOpenModal(template: TemplateRef<any>, valEvent: any) {
    this.idApiClient = valEvent.id
    this.selectedItemsModel = []

    for (let entry of valEvent.operationType) {
      const resultado = this.dropdownList.find((val: any) => val.id == entry.idOperationType);
      this.selectedItemsModel.push(resultado)
    }

    if (valEvent.operationType.lenght != 0){
      this.selectedItems = []
      this.selectedItems = this.selectedItemsModel
    }

    this.modalRef = this.modalService.show(template, {
      ignoreBackdropClick: true,
      keyboard: false
    });
  }

  onItemDeSelect(item: any) {
    this.removeItem(this.selectedItems, item);
  }

  onSelectAll(items: any) {
    this.selectedItems.push(items);
  }

  onItemDeSelectAll(items: any) {
    this.selectedItems = [];
  }

  removeItem<T>(arr: Array<T>, value: any): Array<T> {
    const index = this.selectedItems.map((e: any) => e.id).indexOf(value.id);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  onItemSelect(item: any) {
    //const pos = this.selectedItems.map((e: any) => e.id).indexOf(item.id);
    this.selectedItems.push(item);
    console.log(this.selectedItems);
  }

  save() {
    var apiAssign = new ApiAssignPermissionClient()
    apiAssign.id_api_client = this.idApiClient
    apiAssign.list_id_permission = this.getPermisosIdSelected()

    this.modalRef?.hide();
    this.apiClienService.asignPermission(apiAssign).subscribe(data => {
      console.log("ok test ", data)
      this.modalRef?.hide();
      this.ListadoClientesApi();
    })
  }

  getPermisosIdSelected(): any[] {
    var ids: string[] = [];

    if (this.selectedItems.lenght === 0) {
      return ids;
    }

    for (let item of this.selectedItems) {
      ids.push(item.id);
    }

    return ids;
  }

  clearFilter() {
    this.filter = "";
  }
  
  updateIconColor() {
    this.clearIconColor = this.clearIconColor == "" ? "primary" : "";
  }
  
  sortData(sort: Sort) {
    if (this.order) {
      this.order.active = sort.active;
      this.order.direction = sort.direction;
    }
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
