//https://valor-software.com/ng2-file-upload/
//https://github.com/valor-software/ng2-file-upload
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { PlanService } from '../../services/plan.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { dateValidator } from '../../../utils/date-range.validators';
import {
  CertificateInfo,
  clienteCertificadosAsociacion,
  Plan,
  planClienteAsociacion,
  planClienteCertificadoAsociacion,
} from '../../interfaces/plan';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { parseString } from 'xml2js';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import {
  commonConfig,
  esRangeLabel,
  handlerResponseError,
  nestedFilterCheck,
  readFileContent,
  removeItem,
  useRegex,
  useRegexAvoidZeroAtbeginning,
} from 'src/app/utils/common-configs';
import { Cliente } from 'src/app/clientes/interfaces/clientes.interface';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TableColumn } from 'src/app/shared/components/mat-reusable-table/mat-reusable-table.interface';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AssociatePlanDialogComponent } from '../associate-plan-dialog/associate-plan-dialog.component';
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
  displayedColumns = ['nombre', 'cantidadFirmas', 'costo', 'activo', 'cantidad_certificados', 'descripcion', 'actions'];
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  filter: string = "";
  searchIcon: string = "";
  clearIconColor: string = "";
  isLoadingResults: boolean = false;
  order?: Sort;
  
  //array para filtrar solamente los clientes naturales o jurídicos dependiendo del tipo de plan seleccionado
  filterData: Cliente[] = [];
  viewDropdown: boolean = false;

  files!: FileList | null;
  nombreFieldErrorMsg: string = 'Nombre de Plan requerido ';

  //Para especificar simple selección o selección múltiple de fichero, dependiendo del plan seleccionado.
  multipleFiles: boolean = false;
  //Plan seleccionado a asociar con cliente y certificados, útil para discriminar si es un plan Natural o Jurídico y de este modo
  //establecer al control fileUpload si es de selección simple o múltiple.
  planAsociar!: Plan;

  fileInfo!: string;
  hiddenLoading!: boolean;
  hiddenTableCertificados!: boolean;
  formAsociarValid!: boolean;
  abortTxtProcessing: boolean = false;

  displayedColumnsPlan: string[] = [
    'nombre',
    'duracion',
    'inicio',
    'costo',
    'estado',
    'clienteApi',
    'tipoPlanNatural',
    'pago',
    'moneda',
    'limite',
  ];
  /*displayedColumns: string[] = ['name', 'id'];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;*/

  dataSourcePlan = new MatTableDataSource<any>();
  dataSourceCertificados = new MatTableDataSource<any>();
  // dataSourceCertificados!: MatTableDataSource<any>;
  //Nuevo mecanismo para poblar de datos el componente 'app-mat-reutilizable-table'
  planesList!: Plan[];
  planesTableColumns!: TableColumn[];

  @ViewChild('file', { static: false }) file: any;

  // @ViewChild(MatPaginator) set paginator(value: MatPaginator) {
  //   this.dataSourceCertificados.paginator = value;
  //   this.setDataSourceAttributes();
  // }

  setDataSourceAttributes() {
    //this.dataSourceCertificados.paginator = this.paginator;

    if (this.paginator) {
    }
  }
  // @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  // @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  // @ViewChild(MatPaginator)
  // set paginator(value: MatPaginator) {
  //   this.dataSourceCertificados.paginator = value;
  // }

  // actualPaginator!: MatPaginator;
  // @ViewChild(MatPaginator)
  // set paginator(value: MatPaginator) {
  //   this.actualPaginator = value;
  // }

  //Not use {static:true}
  // @ViewChild('paginatorCertificados', { static: true })
  // paginator!: MatPaginator;
  // @ViewChild(MatPaginator, { static: false })
  // set paginator(value: MatPaginator) {
  //   this.dataSourceCertificados.paginator = value;
  // }
  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  //dropdownList section
  dropdownListTiposPago: any = [];
  dropdownListMonedas: any = [];
  dropdownListClientes: any = [];
  selectedItemsTiposPago: any = [];
  selectedItemsMonedas: any = [];
  selectedItemCliente: any = [];
  dropdownSettings: IDropdownSettings = {};
  dropdownSettingsClientes: IDropdownSettings = {};

  //Referencia al modal del create/update item
  modalRef?: BsModalRef;
  //variables utilizadas en el modal de listar permisos asignados al rol
  selectedRol!: any;
  titleAsociacionModal: string = '';
  idPlanModal: number = 0;
  nombreModal: string = '';
  duracionModal!: number;
  inicioModal!: any;
  costoModal!: number;
  estadoModal!: boolean;
  tipoPagoModal!: string;
  monedaModal: string = '';
  limiteCertificadosModal!: number;
  descripcionModal: string = '';

  listadoPermisosAsignadosModal: any[] = [];

  form!: FormGroup;
  formAsociar!: FormGroup;
  p: number = 1;
  pModalPermisos: number = 1;
  searchText = '';

  inicio: any;
  isChecked!: boolean;
  isCheckedTipoPlan!: boolean;
  isCheckedTipoPlanNatural!: boolean;
  disableImp: boolean = true;

  // certificadosCliente!: { certificate_id: string; name: string }[];
  certificadosCliente!: CertificateInfo[];

  itemPluralMapping = {
    plan: {
      '=1': 'mes',
      other: 'meses',
    },
  };

  // @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
  //   this.dataSourceCertificados.paginator = paginator;
  // }

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    readonly service: PlanService,
    private datePipe: DatePipe,
    private http: HttpClient,
    public _MatPaginatorIntl: MatPaginatorIntl,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog
  ) { }

  // @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
  //   this.dataSourceCertificados.paginator = paginator;
  // }

  // @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
  //   this.paginator = mp;
  //   this.dataSourceCertificados.paginator = this.paginator;
  // }
  // @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
  //   this.paginator = mp;
  //   this.setDataSourceAttributes();
  // }

  // setDataSourceAttributes() {
  //   this.dataSourceCertificados.paginator = this.paginator;
  // }

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

  ngOnInit(): void {
    this.order = { active: "", direction: "" };
    this.filter = "";
    this.searchIcon = "search";
    this.clearIconColor = "";

    this.isAuthenticatedUser();
    this.initializeColumns();
    this.isChecked = true;

    this._MatPaginatorIntl.firstPageLabel = 'Primera página';
    this._MatPaginatorIntl.itemsPerPageLabel = 'Planes por página:';
    this._MatPaginatorIntl.lastPageLabel = 'Ultima página';
    this._MatPaginatorIntl.nextPageLabel = 'Página siguiente';
    this._MatPaginatorIntl.previousPageLabel = 'Página anterior';
    this._MatPaginatorIntl.getRangeLabel = esRangeLabel;
    
    this.service.fetchList();
    this.getListadoPlanes();
    //Invocamos al servicio de roles para que este haga lo necesario y el listado de roles en nuestro control multiselect se llene de datos
    this.service.fetchListTiposPago();
    this.service.fetchListMonedas();
    // this.service.fetchListClientes();

    this.FormGroupInit();
    this.FormGroupInitAsociar();
    // this.dropdownInitClientes();
    this.dropdownInitTiposPago();
    this.dropdownInitMonedas();

    this.hiddenLoading = true;
    this.hiddenTableCertificados = true;
    this.formAsociarValid = true;

  }

  ngAfterViewInit() {
    
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    
    this.isChecked = true;
    this.isCheckedTipoPlan = false;
    this.isCheckedTipoPlanNatural = false;
  }

  /**
   * Description: Obtenemos listado de planes
   * @returns {any}
   *  */
  private getListadoPlanes(): void {
    this.isLoadingResults = true;
    this.service.fetchListAsObservable().subscribe((resp) => {
      this.isLoadingResults = false;
      this.planesList = resp;
      this.dataSource.data = this.planesList
    });
  }

  /**
   * Description: Function para initializar columnas del listado de clientes API
   * @returns {any}
   *  */
  private initializeColumns(): void {
    this.planesTableColumns = [
      {
        name: 'Nombre',
        dataKey: 'nombre',
        position: 'left',
        isSortable: true,
      },
      // {
      //   name: 'Duración',
      //   dataKey: 'duracion',
      //   position: 'left',
      //   isDate: true,
      //   isSortable: false,
      // },
      {
        name: 'Límite de Firmas',
        dataKey: 'cantidadFirmas',
        position: 'left',
        isDate: true,
        isSortable: true,
      },
      // {
      //   name: 'Fecha Inicio',
      //   dataKey: 'inicio',
      //   position: 'left',
      //   isSortable: true,
      // },
      {
        name: 'Costo',
        dataKey: 'costo',
        position: 'left',
        isSortable: false,
      },
      {
        name: 'Estado',
        dataKey: 'activo',
        position: 'left',
        isBooleable: true,
      },
      // {
      //   name: 'Aplica Cliente API',
      //   dataKey: 'tipoPlan',
      //   position: 'left',
      //   isBooleable: true,
      // },
      // {
      //   name: 'Tipo Plan',
      //   dataKey: 'tipoPlanNatural',
      //   position: 'left',
      //   isDate: true,
      //   isSortable: false,
      // },
      // {
      //   name: 'Tipo de Pago',
      //   dataKey: 'tipoPagoDto.descripcion',
      //   position: 'left',
      //   isDate: true,
      //   isSortable: true,
      // },
      // {
      //   name: 'Moneda',
      //   dataKey: 'monedaDto.descripcion',
      //   position: 'left',
      //   isSortable: true,
      // },
      {
        name: 'Límite de Certificados',
        dataKey: 'cantidad_certificados',
        position: 'center',
        isDate: true,
        isSortable: false,
      },
      {
        name: 'Descripción',
        dataKey: 'descripcion',
        position: 'left',
        isDate: true,
        isSortable: true,
      },
    ];
  }

  // //https://stackoverflow.com/questions/57700078/angular-material-mat-table-not-returning-any-results-upon-filter
  // //also add this nestedFilterCheck class function
  // nestedFilterCheck(search: any, data: any, key: any) {
  //   if (typeof data[key] === 'object') {
  //     for (const k in data[key]) {
  //       if (data[key][k] !== null) {
  //         search = this.nestedFilterCheck(search, data[key], k);
  //       }
  //     }
  //   } else {
  //     search += data[key];
  //   }
  //   return search;
  // }

  /**
   * Description
   * @param {Event} event
   * @returns {any}
   *  */
  /*applyFilter(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;
    // console.log(filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSourceCertificados.filter = filterValue;
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSourceCertificados.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceCertificados.paginator) {
      this.dataSourceCertificados.paginator.firstPage();
    }
  }*/

  /**
   * Description: Function para inicializar el FormBuilder
   * @returns {any}
   *  */
  private FormGroupInit(): void {
    this.form = this.fb.group({
      // id: [''],
      id: [], //Estaba inicializado como [''] y asi tenía valor empty pero tenía
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern(/^[a-zA-ZñÑ,]+$/), //Solo letras
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
      cantCertificados: ['', [Validators.required, Validators.minLength(1)]],
      duracion: [
        '',
        [Validators.required, Validators.pattern(/^((?!(0){1,2})[0-9]{1,2})$/)],
      ],
      inicio: [
        this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        [
          Validators.required,
          Validators.pattern(
            /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
          ),
          dateValidator(),
        ],
      ],
      costo: ['', [Validators.required, Validators.minLength(2)]],
      estado: [''],
      tiposPago: ['', [Validators.required]],
      moneda: ['', [Validators.required]],
      tipoPlan: [''],
      tipoPlanNatural: [''],
      cantidadFirmas: [
        '',
        [
          Validators.required,
          Validators.pattern(/^((?!(0){1,1000})[0-9]{1,1000})$/),
        ],
      ],
    });
  }

  /**
   * Description: Function para evitar introducir el caracter "." en campos numéricos donde solamente nos interecen valores enteros
   * https://www.appsloveworld.com/reactjs/100/11/reactjs-prevent-e-and-dot-in-an-input-type-number
   * @param {any} event
   * @returns {any}
   *  */
  avoidDotCharacter(event: any): void {
    // if (useRegexAvoidZeroAtbeginning(event.value)) {
    //   event.preventDefault();
    // }
    if (event.key == '.' || event.key === ',') {
      event.preventDefault();
    }
  }

  /**
   * Description: Function para inicializar el FormBuilder para asociar clientes, planes y certificados
   * @returns {any}
   *  */
  private FormGroupInitAsociar(): void {
    this.formAsociar = this.fb.group({
      planId: ['', [Validators.required]],
      clienteId: ['', [Validators.required]],
      certificadosId: ['', [Validators.required]],
    });
  }
  /**
   * Description Evento checked change del select Plan Activo
   * @param {any} e
   * @returns {any}
   *  */
  onNativeChange(e: any): any {
    this.isChecked = e.target.checked;
  }

  /**
   * Description Evento checked change del select "Aplica Cliente API"
   * @param {any} e
   * @returns {any}
   *  */
  onNativeChangeTipoPlan(e: any): any {
    this.isCheckedTipoPlan = e.target.checked;
    e.target.checked
      ? this.form.controls['tipoPlanNatural'].disable()
      : this.form.controls['tipoPlanNatural'].enable();

    if (e.target.checked) this.isCheckedTipoPlanNatural = false;
  }

  /**
   * Description Evento checked change del select "Tipo Plan Natural"
   * @param {any} e
   * @returns {any}
   *  */
  onNativeChangeTipoPlanNatural(e: any): any {
    this.isCheckedTipoPlanNatural = e.target.checked;
    // console.log(this.isCheckedTipoPlanNatural);
    // console.log(this.form.value);
  }

  /**
   * Description Inicializamos los valores del multiselect control para listar las formas de pago
   * @returns {any}
   *  */
  dropdownInitTiposPago(): void {
    this.service.itemsTiposPago$.subscribe(
      (data) => {
        if (data) {
          this.dropdownListTiposPago = data;
        }
      },
      (err: HttpErrorResponse) => {
        handlerResponseError(err);
      }
    );
    // console.log(this.dropdownListTiposPago);
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'descripcion',
      selectAllText: 'Marcar todos',
      unSelectAllText: 'Desmarcar todos',
      closeDropDownOnSelection: true,
      allowSearchFilter: true,
      searchPlaceholderText: 'Buscar',
      noDataAvailablePlaceholderText: 'No se ha encontrado ningún resultado',
      noFilteredDataAvailablePlaceholderText:
        'No se ha encontrado ningún resultado',
    };
  }

  /**
   * Description Inicializamos los valores del multiselect control para listar las monedas
   * @returns {any}
   *  */
  dropdownInitMonedas(): void {
    this.service.itemsMonedas$.subscribe(
      (data) => {
        if (data) {
          this.dropdownListMonedas = data;
        }
      },
      (err: HttpErrorResponse) => {
        handlerResponseError(err);
      }
    );
    // console.log(this.dropdownListMonedas);
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'descripcion',
      selectAllText: 'Marcar todos',
      unSelectAllText: 'Desmarcar todos',
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      searchPlaceholderText: 'Buscar',
      noDataAvailablePlaceholderText: 'No se ha encontrado ningún resultado',
      noFilteredDataAvailablePlaceholderText:
        'No se ha encontrado ningún resultado',
    };
  }

  /**
   * Description Inicializamos los valores del multiselect control para listar los clientes
   * @returns {any}
   *  */
  dropdownInitClientes(tipoPlanNatural: boolean): void {
    this.dropdownSettingsClientes = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      allowSearchFilter: true,
      searchPlaceholderText: 'Buscar',
      noDataAvailablePlaceholderText: 'No se ha encontrado ningún resultado',
      noFilteredDataAvailablePlaceholderText:
        'No se ha encontrado ningún resultado',
    };
    let response: Cliente[] = [];
    this.service.itemsClientes$.subscribe(
      (data: Cliente[]) => {
        if (data) {
          // console.log(data);
          //Asignamos todos los clientes que no han sido asociados aún al plan seleccionad, sin aplicar filtro sobre los clientes
          // this.dropdownListClientes = data;
          // Asignamos todos los clientes que no han sido asociados aún al plan seleccionad, dependiendo del tipo de cliente y el tipo de plan seleccionado
          response = data;
          // var uniq = [...new Set(filterData)];
          // console.log(filterData);
          // setTimeout(() => {
          //   this.dropdownListClientes = filterData;
          this.newMethod(tipoPlanNatural, this.filterData, response);
          // }, 2000);
        }
      },
      (err: HttpErrorResponse) => {
        handlerResponseError(err);
      }
    );

    // console.log(this.dropdownListClientes);
  }

  private newMethod(
    tipoPlanNatural: boolean,
    filterData: Cliente[],
    data: Cliente[]
  ) {
    if (tipoPlanNatural) {
      filterData = [];
      for (const employee of data) {
        if (!employee.institutional) {
          const details: any = {
            id: employee.id,
            name: employee.name,
          };
          //Verificamos si el objeto existe previamente en el array filterData
          const found = filterData.find((obj) => obj.name === details.name);
          //Si no existe, lo adicionamos entonces
          if (!found) filterData.push(details);
        }
      }
    } else {
      filterData = [];
      for (const employee of data) {
        if (employee.institutional) {
          const details: any = {
            id: employee.id,
            name: employee.name,
          };
          //Verificamos si el objeto existe previamente en el array filterData
          const found = filterData.find((obj) => obj.name === details.name);
          //Si no existe, lo adicionamos entonces
          if (!found) filterData.push(details);
        }
      }
    }
    !filterData.length
      ? (this.viewDropdown = false)
      : (this.viewDropdown = true);
    this.dropdownListClientes = filterData;
    return filterData;
  }

  /**
   * Description
   * @param {any} item
   * @returns {any}
   *  */
  onItemSelectCliente(item: any): any {
    //Habilitamos el btn de importar certificado, siempre que se seleccione al menos un cliente
    this.disableImp = false;
    //Habilitamos el btn de salvar asociación, siempre y cuando se esté mostrando la tabla de listado de certificados, previamente cargada
    if (!this.hiddenTableCertificados) this.formAsociarValid = false;
    this.selectedItemCliente = [];
    this.selectedItemCliente.push(item);
    // console.log(this.selectedItemCliente);
  }

  /**
   * Description
   * @param {any} item
   * @returns {any}
   *  */
  onItemDeSelectCliente(item: any): any {
    //DesHabilitamos el btn de importar certificado, hasta que se seleccione al menos un cliente
    this.disableImp = true;
    //DesHabilitamos el btn de salvar asociación, hasta que se seleccione al menos un cliente
    this.formAsociarValid = true;
    removeItem(this.selectedItemCliente, item);
    this.selectedItemCliente = [];
    // console.log(this.selectedItemCliente);
  }

  /**
   * Description
   * @param {any} item
   * @returns {any}
   *  */
  onItemSelectMoneda(item: any): any {
    this.selectedItemsMonedas = [];
    this.selectedItemsMonedas.push(item);
    // console.log(this.selectedItemsMonedas);
  }

  /**
   * Description
   * @param {any} item
   * @returns {any}
   *  */
  onItemDeSelectMoneda(item: any): any {
    this.removeItem(this.selectedItemsMonedas, item);
    this.selectedItemCliente = [];
    // console.log(this.selectedItemsMonedas);
  }

  /**
   * Description
   * @param {any} item
   * @returns {any}
   *  */
  onItemSelect(item: any): any {
    // console.log(item);
    // this.selectedItemsTiposPago.push(item);
    this.selectedItemsTiposPago = [];
    this.selectedItemsTiposPago.push(item);
    // console.log(this.selectedItemsTiposPago);
  }

  /**
   * Description
   * @param {any} item
   * @returns {any}
   *  */
  onItemDeSelect(item: any): any {
    // const index1 = this.selectedItems.findIndex((element: any) => {
    //   return element.id === item.id;
    // });
    // this.selectedItems.splice(index1, 1);
    this.removeItem(this.selectedItemsTiposPago, item);
    // console.log(this.selectedItemsTiposPago);
  }

  /**
   * Description
   * @param {any} items
   * @returns {any}
   *  */
  onSelectAll(items: any): any {
    //
    this.selectedItemsTiposPago.push(items);
    // console.log(this.selectedItemsTiposPago);
  }

  /**
   * Description
   * @param {any} items
   * @returns {any}
   *  */
  onItemDeSelectAll(items: any): any {
    //
    this.selectedItemsTiposPago = [];
    // console.log(this.selectedItemsTiposPago);
  }

  /**
   * Description
   * https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
   * @param {Array<T>} arr
   * @param {T} value
   * @returns {any}
   *  */
  removeItem<T>(arr: Array<T>, value: T): Array<T> {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  /**
   * Description Obtener ids de permisos seleccionados, se utiliza en las acciones create/update
   * @returns {any}
   *  */
  getMonedasIdSelected(): number {
    var id!: number;

    if (this.selectedItemsMonedas.lenght === 0) {
      return id;
    }

    for (let item of this.selectedItemsMonedas) {
      id = item.id;
    }

    return id;
  }

  /**
   * Description Obtener ids de permisos seleccionados, se utiliza en las acciones create/update
   * @returns {any}
   *  */
  getTipoPagoIdSelected(): number {
    var id!: number;

    if (this.selectedItemsTiposPago.lenght === 0) {
      return id;
    }

    for (let item of this.selectedItemsTiposPago) {
      id = item.id;
    }

    return id;
  }

  /**
   * Description Obtener ids de permisos seleccionados, se utiliza en las acciones create/update
   * @returns {any}
   *  */
  getClientesIdSelected(): number {
    var id!: number;

    if (this.selectedItemCliente.lenght === 0) {
      return id;
    }

    for (let item of this.selectedItemCliente) {
      id = item.id;
    }

    return id;
  }

  /**
   * Description: Modal para mostrar interfaz para las opciones create/update
   * @param {TemplateRef<any>} template
   * @param {User} user?
   * @returns {any}
   *  */
  openModal(template: TemplateRef<any>, plan?: Plan): any {
    if (plan !== undefined) {
      //Asignamos los permisos del rol a modificar al array de selectedItems bindeado con el componente multiselect
      // this.selectedItems = rol.operationTypes;
      // this.inicio = this.datePipe.transform(plan.inicio, 'yyyy-dd-MM'); Así estaba antes
      // id = 'inicio';
      // name = 'inicio'
      // [ngModel] = 'inicio';

      this.selectedItemsMonedas = [
        {
          id: plan.monedaDto.id,
          descripcion: plan.monedaDto.descripcion,
        },
      ];
      this.selectedItemsTiposPago = [
        {
          id: plan.tipoPagoDto.id,
          descripcion: plan.tipoPagoDto.descripcion,
        },
      ];
      // console.log('Tipo de pago: ' + this.selectedItemsTiposPago);
      // console.log('Moneda: ' + this.selectedItemsMonedas);
      this.isChecked = plan.activo ? true : false;
      this.isCheckedTipoPlan = plan.tipoPlan ? true : false;
      this.isCheckedTipoPlanNatural = plan.tipoPlanNatural ? true : false;
      // var result = Object.keys(plan.monedas).map((key: any) => [
      //   Number(key),
      //   plan.monedas[key],
      // ]);

      // console.log(result);
      // var result = Object.entries(plan.monedas);

      // console.log(result);
      // this.selectedItemsMonedas = [
      //   { id: plan.monedas.id, descripcion: plan.monedas.descripcion },
      // ];
      this.form.controls['inicio'].disable();
      // // updates form values if there is a user
      this.form.patchValue({
        id: plan.id,
        nombre: plan.nombre,
        descripcion: plan.descripcion,
        cantCertificados: plan.cantidad_certificados,
        duracion: plan.duracion,
        inicio: this.datePipe.transform(plan.inicio, 'yyyy-MM-dd'),
        costo: plan.costo,
        estado: plan.activo ? true : false,
        tipoPlan: plan.tipoPlan ? true : false,
        cantidadFirmas: plan.cantidadFirmas,
      });
      this.form.controls['estado'].enable();
    } else {
      // reseteamos los valorees del array de selectedItems bindeado con el componente multiselect
      // console.log('Tipo de pago: ' + this.selectedItemsTiposPago);
      // console.log('Moneda: ' + this.selectedItemsMonedas);
      this.selectedItemsTiposPago = [];
      this.selectedItemsMonedas = [];
      this.isChecked = true;
      this.form.controls['estado'].disable();
      this.form.controls['inicio'].enable();
      this.form.reset(); //reseteamos los posibles valores adicionados en el update form
      this.FormGroupInit(); //Iniciamos nuevamente el form de API Cliente para inicializar los valores deseados, como ocurreo con el campo Fecha Alta
    }
    // console.log(this.form.value);
    this.modalRef = this.modalService.show(template, {
      ignoreBackdropClick: true,
      keyboard: false,
      // class: 'modal-dialog-centered modal-dialog-scrollable',
      // class: 'modal-dialog-scrollable',
    });
  }

  /**
   * Description
   * @param {TemplateRef<any>} template
   * @param {Rol} rol?
   * @returns {any}
   *  */
  openModalAsociacion(template: TemplateRef<any>, plan: Plan): any {
    this.planAsociar = plan;
    //Obtenemos los clientes que aún no han sido asociado al plan que se recibe como params
    this.service.fetchListClientes(plan.id!);
    // this.service.itemsClientes$.subscribe((result) => {
    //   console.log(result.length);
    // });
    // this.sleep(5000);
    // console.log(plan.tipoPlanNatural);
    //Inicializamo el control dropdown de clientes
    this.dropdownInitClientes(plan.tipoPlanNatural);
    // @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
    // console.log(this.paginator);
    // this.dataSourceCertificados.paginator = this.paginator;
    // this.matPaginator = this.paginator;

    //Especificamos el nombre del modal
    this.titleAsociacionModal = `Asociar plan, cliente y certificados`;
    this.idPlanModal = plan.id!;
    // console.log(this.idPlanModal);
    this.nombreModal = plan!.nombre;
    this.duracionModal = plan!.duracion;
    this.inicioModal = this.datePipe.transform(plan!.inicio, 'yyyy-dd-MM');
    this.costoModal = plan!.costo;
    this.estadoModal = plan!.activo;
    this.tipoPagoModal = plan.tipoPagoDto != undefined ? plan!.tipoPagoDto.descripcion : "";
    this.monedaModal = plan.monedaDto != undefined ? plan!.monedaDto.descripcion : "";
    this.tipoPagoModal = plan.tipoPagoDto != undefined ? plan!.tipoPagoDto.descripcion : "";
    this.monedaModal = plan.monedaDto != undefined ? plan!.monedaDto.descripcion : "";
    this.limiteCertificadosModal = plan?.cantidad_certificados!;
    this.descripcionModal = plan!.descripcion;

    const data: {
      nombre: string;
      duracion: number;
      inicio: number;
      costo: number;
      estado: boolean;
      pago: string;
      moneda: string;
      limite: number;
      tipoPlan: boolean;
    }[] = [
        {
          nombre: plan.nombre,
          duracion: plan.duracion,
          inicio: plan.inicio,
          costo: plan.costo,
          estado: plan.activo,
          pago: plan.tipoPagoDto != undefined ? plan.tipoPagoDto.descripcion : "",
          moneda: plan.monedaDto != undefined ? plan.monedaDto.descripcion : "",
          limite: plan.cantidad_certificados,
          tipoPlan: plan.tipoPlan,
        },
      ];

    this.dataSourcePlan = new MatTableDataSource<any>(data);

    //Seteamos el listado de permisos asignados del rol, al listado definido como variable bindeada con el component.html.
    // this.listadoPermisosAsignadosModal = rol?.operationTypes!;
    //asignamos el rol seleccionado con el rol bindeado con el component.html
    // this.selectedRol = rol!;
    // console.log(this.form.value.name);
    //https://stackoverflow.com/questions/48881432/ngx-bootstrap-when-modal-height-is-dynamic-scroll-is-not-coming
    this.modalRef = this.modalService.show(template, {
      ignoreBackdropClick: true,
      keyboard: false,
      // class: 'modal-dialog-centered modal-dialog-scrollable',
      // class: 'modal-dialog-scrollable',
    });
    this.modalRef.onHide!.subscribe((reason: string | any) => {
      //reiniciamos en 0 la selección del control que lista los clientes
      this.selectedItemCliente = [];
      //seteamos en true la propiedad que inhabilita el botón de seleccionar certificados
      this.disableImp = true;
      //seteamos en blank el div que muestra la info del fichero seleccionado
      this.fileInfo = '';
      //seteamos en true la property que invalida este formulario de asociacion
      this.formAsociarValid = true;
      //seteamos en true la property que oculta el grid de certificados
      this.hiddenTableCertificados = true;

      // this.dropdownListClientes = [];
    });
  }

  /**
   * Description
   * @returns {any}
   *  */
  SaveChanges(): void {
    // console.log(this.form.value.id);
    if (this.form.value.id !== null) {
      //TODO: Implementar mecanismo para lógica de update
      // this.updateRol();
      // console.log('update');
      this.updatePlan();
    } else {
      if (this.form.valid) {
        // console.log('create');
        // this.addRol();
        this.addPlan();
      }
    }
    this.getListadoPlanes();
  }

  /**
   * Description
   * @returns {any}
   *  */
  private addPlan(): any {
    const plan: Plan = {
      // identifier: this.form.value.identificador,
      // begin_date: Date.parse(this.form.value.fechaAlta),
      // end_date: Date.parse(this.form.value.fechaBaja),
      nombre: this.form.value.nombre,
      descripcion: this.form.value.descripcion,
      duracion: this.form.value.duracion,
      // duracion: 1679529600000,
      inicio: Date.parse(this.form.value.inicio),
      costo: this.form.value.costo,
      cantidad_certificados: this.form.value.cantCertificados,
      vigencia_compra: 0,
      activo: true,
      // tipoPago: 1,
      // moneda: 1,
      tipoPago: this.getTipoPagoIdSelected(),
      monedas: this.getMonedasIdSelected(),
      tipoPlan: this.isCheckedTipoPlan,
      tipoPlanNatural: this.isCheckedTipoPlanNatural,
      cantidadFirmas: this.form.value.cantidadFirmas,
    } as Plan;

    // console.log(JSON.stringify(apiClient));
    this.service.addItem(plan);
    this.getListadoPlanes();
    this.modalRef?.hide();
  }

  /**
   * Description
   * @returns {any}
   *  */
  private updatePlan(): any {
    const rol: Plan = {
      id: this.form.value.id,
      nombre: this.form.value.nombre,
      descripcion: this.form.value.descripcion,
      duracion: this.form.value.duracion,
      inicio: Date.parse(this.form.controls['inicio'].value), //disabled control
      costo: this.form.value.costo,
      cantidad_certificados: this.form.value.cantCertificados,
      vigencia_compra: 0,
      activo: this.isChecked,
      tipoPago: this.getTipoPagoIdSelected(),
      monedas: this.getMonedasIdSelected(),
      tipoPlan: this.isCheckedTipoPlan,
      tipoPlanNatural: this.isCheckedTipoPlanNatural,
      cantidadFirmas: this.form.value.cantidadFirmas,
    } as Plan;

    // console.log(user);
    this.service.updateItem(rol).subscribe({
      next: (data) => {
        this.service.updateItemLocalService(rol.id!, data);
        this.getListadoPlanes();
        Swal.fire(
          // '!Plan modificado!',
          // `El plan con identificador ${rol.nombre} ha sido modificado correctamente`,
          // 'success'
          {
            title: '¡Plan modificado!',
            html: `El plan con identificador ${rol.nombre} ha sido modificado correctamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            ...commonConfig,
          }
        );
        // console.log(data);
      },
      error: (err: HttpErrorResponse) => {
        // Swal.fire(
        //   {
        //     title: '¡Error modificando plan!',
        //     html: `Ha ocurrido el siguiente error ${error.message}`,
        //     icon: 'error',
        //     confirmButtonText: 'Aceptar',
        //     ...commonConfig,
        //   }
        // );
        if (err.error instanceof Error) {
          //A client-side or network error occurred.
          console.log('An error occurred:', err.error.message);
          Swal.fire(
            // 'Ha ocurrido el siguiente error!',
            // err.error.message,
            // 'error'
            {
              title: '¡Ha ocurrido el siguiente error!',
              html: ` ${err.message} `,
              icon: 'error',
              confirmButtonText: 'Aceptar',
              ...commonConfig,
            }
          );
        } else {
          //Backend returns unsuccessful response codes such as 404, 500 etc.
          console.log('Backend returned status code: ', err.status);
          console.log('Response body:', err.error);
          Swal.fire(
            // 'Ha ocurrido el siguiente error!',
            // err.status + err.error.message,
            // 'error'
            {
              title: '¡Ha ocurrido el siguiente error!',
              html: `Error: <strong>${err.status}</strong>: <div style="text-align: justify;">${err.error.message}</div>. `,
              icon: 'error',
              confirmButtonText: 'Aceptar',
              ...commonConfig,
            }
          );
        }
      },
    });

    this.modalRef?.hide();
  }

  /**
   * Description Function para eliminar clientes api
   * @param {number} index: id del cliente api a eliminar
   * @returns {any}
   *  */
  deletedItem(item: Plan): void {
    let texto: string = '';
    // item.inuse === 1
    //   ? (texto = `El rol ${item.name} es un rol activo del sistema`)
    //   : (texto = '');
    Swal.fire({
      title: `¿Está seguro de eliminar el plan con identificador: ${item.nombre} ?`,
      text: `Este proceso es irreversible, preste mucha atención.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'No, cancelar esta acción',
    }).then((result) => {
      if (result.value) {
        //TODO: incluir llamada a lógica del service correspondiente para eliminar lógicamente este item
        //TODO: y dentro del suscribe, manejamos el tipo de mensaje a retornar
        this.service.deletedItem(item).subscribe(
          (resp) => {
            // this._userList.next(resp.data);
            this.service.deleteItemLocalService(item.id!);
            this.getListadoPlanes();
            //this.ObtenerListadoUsuarios();
            Swal.fire(
              // 'Eliminado!',
              // `El plan con identificador ${item.nombre} ha sido eliminado correctamente`,
              // 'success'
              {
                title: '¡Eliminado!',
                html: `El rol con identificador ${item.nombre} ha sido eliminado correctamente`,
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
        Swal.fire({
          title: '¡Eliminado!',
          html: `El plan con identificador ${item.nombre} ha sido eliminado correctamente`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          ...commonConfig,
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
      }
    });
  }

  /**
   * Description
   * @returns {any}
   *  */
  impCertificados(): void {
    // this.file.nativeElement.click();
    this.hiddenLoading = true;
    // this.hiddenTableCertificados = true;
  }

  /**
   * Description
   * @param {any} m
   * @returns {any}
   *  */
  sleep = (m: any): any => new Promise((r) => setTimeout(r, m));

  /**
   * Description
   * @param {number} limit
   * @param {File} file
   * @returns {any}
   *  */
  getXMLFile(limit: number, file: File): void {
    this.http
      .get('assets/certificados.xml', {
        headers: new HttpHeaders()
          .set('Content-Type', 'text/xml')
          .append('Access-Control-Allow-Methods', 'GET')
          .append('Access-Control-Allow-Origin', '*')
          .append(
            'Access-Control-Allow-Headers',
            'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method'
          ),
        responseType: 'text',
      })
      .subscribe((data) => {
        // console.log(data);
        this.parseResponse(data, limit, file);
      });
  }

  /**
   * Description
   * @param {string} data
   * @param {number} limit
   * @param {File} file
   * @returns {any}
   *  */
  private parseResponse(data: string, limit: number, file: File): any {
    parseString(data, (err, result) => {
      var arr: any[] = this.transformtXMLContentToArray(result);
      // console.log(arr);

      if (arr.length > limit) {
        Swal.fire(
          // `Ha ocurrido el siguiente error`,
          // `Fichero ${file.name} tiene un total de certificados que excede el límite de certificados permitidos en el plan.`,
          // 'error'
          {
            title: '¡Ha ocurrido el siguiente error!',
            html: `Fichero ${file.name} tiene un total de certificados que excede el límite de certificados permitidos en el plan.`,
            icon: 'error',
            confirmButtonText: 'Aceptar',
            ...commonConfig,
          }
        );
      } else {
        // this.formAsociar.markAllAsTouched();
        // this.form.value.planId = 1;
        // this.form.value.certificadosId = [];
        // this.validateAllFormFields(this.formAsociar);
        this.formAsociarValid = false;
      }
    });
  }

  /**
   * Description: Procesa contenido de fichero xml
   * @param {any} result
   * @returns {any}
   *  */
  private transformtXMLContentToArray(result: { Certificados: any }): any[] {
    var k: string | number,
      arr: any[] = [];
    var obj = result.Certificados;
    for (k in obj.certificado) {
      var item = obj.certificado[k];
      arr.push({
        id: item.id[0],
        name: item.name[0],
        email: item.denom[0],
      });
    }
    return arr;
  }

  /**
   * Called when the value of the file input changes, i.e. when a file has been
   * selected for upload.
   *
   * @param input the file input HTMLElement
   */
  async onFileSelect(input: HTMLInputElement, limit: number): Promise<void> {
    /**
     * Format the size to a human readable string
     *
     * @param bytes
     * @returns the formatted string e.g. `105 kB` or 25.6 MB
     */
    function formatBytes(bytes: number): string {
      const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const factor = 1024;
      let index = 0;

      while (bytes >= factor) {
        bytes /= factor;
        index++;
      }

      return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
    }

    //Ocultamos la tabla de certificados que puede estar visible, por un proceso previo de análisis.
    this.hiddenTableCertificados = true;
    this.fileInfo = '';
    if (this.planAsociar.tipoPlanNatural) {
      //TODO: Implementar lógica correspondiente para procesar un array de ficheros de certificados
      let file = input.files![0].name;
      // console.log(file);
    } else {
      //TODO: Implementar lógica correspondiente para procesar un solo fichero de certificado
      for (let index = 0; index < input.files!.length; index++) {
        const file = input.files![index].name;
        // console.log(file);
      }
    }

    let file = input.files![0];
    // let fileName = input.files![0].name;

    console.log(file);
    // console.log(fileName);
    // const formData: FormData = new FormData();
    // // Append files to the virtual form.
    // for (let index = 0; index < input.files!.length; index++) {
    //   const file = input.files![index].name;
    //   formData.append('file', input.files![index]);
    // }
    this.files = input.files!;

    let puedoContinuar: boolean = true;
    //Iteramos por cada uno de los ficheros que ha seleccionado .crt el usuario para verificar validez de extensión del mismo
    for (let index = 0; index < input.files!.length; index++) {
      const file = input.files![index].name;
      puedoContinuar = this.validate_fileupload(file);

      if (!puedoContinuar) {
        Swal.fire({
          title: '¡Ha ocurrido el siguiente error!',
          html: `Ha seleccionado un fichero (<strong>${file}</strong>) que tiene extensión no permitida, todos los ficheros de certificados tienen que tener extensión de tipo .crt.`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          ...commonConfig,
        });
        return;
      }
    }

    if (puedoContinuar) {
      if (
        !this.CompararContraLimiteCertificadosPlan(
          this.planAsociar.cantidad_certificados,
          null
        )
      ) {
        this.hiddenLoading = false;
        //Solo invocamos al servicio en caso que el número de certificados sea menor igual que el límite de certificados permitidos por el plan.
        this.service.getCertificatesInfo(this.files).subscribe(
          (res: CertificateInfo[]) => {
            // this.certificadosCliente = res;
            // this.hiddenLoading = true;

            // async () => {
            this.sleep(5000000);
            this.hiddenLoading = true;
            this.certificadosCliente = res;
            this.setCertificadosDataSource();
            this.hiddenTableCertificados = false;
            // };
          },
          (err: HttpErrorResponse) => {
            handlerResponseError(err);
          }
        );
      }
      this.files = null;
    }
    // let file = input.files![0];
    // console.log(file);

    // if (file && this.validate_fileupload(file.name.toString())) {
    //   //solo si existe un fichero seleccionado, mostramos el control loading! y procesamos todo lo procesable!
    //   this.hiddenLoading = false;
    //   this.fileInfo = `${file.name} (${formatBytes(file.size)})`;

    //   // const fileContent = await this.readFileContent(file); //new way
    //   // const resultado = fileContent.split(/\r?\n/); //txt files
    //   // // this.parseResponse(fileContent, limit, file);//xml files
    //   // this.dataSource.data = resultado;
    //   // this.dataSource.paginator = this.paginator;
    //   this.dataSourceCertificados.paginator = this.paginator;

    //   (async () => {
    //     // console.time('Slept for');
    //     await this.sleep(3000);
    //     // console.timeEnd('Slept for');
    //     this.hiddenLoading = true;
    //     // this.getXMLFile(limit, file); //old way
    //     const fileContent = await readFileContent(file); //new way

    //     //Validación de fichero vacío
    //     if (fileContent.trim() === '') {
    //       Swal.fire(
    //         // `Ha ocurrido el siguiente error`,
    //         // `El Fichero ${file.name} está vacio, especifique un fichero válido con certificados de clientes.`,
    //         // 'error'
    //         {
    //           title: '¡Ha ocurrido el siguiente error!',
    //           html: `El Fichero ${file.name} está vacio, especifique un fichero válido con certificados de clientes.`,
    //           icon: 'error',
    //           confirmButtonText: 'Aceptar',
    //           ...commonConfig,
    //         }
    //       );
    //       file = new File([], '');
    //     }
    //     //procesamos el contenido del fichero
    //     else {
    //       //Obtenemos primeramente las cadenas de caracteres por cada línea
    //       const resultadoBreakLine = fileContent.split(/\r?\n/); //txt files
    //       //Analizamos entonces cada línea para que cumpla con el patrón permitido por el sistema
    //       //https://regex-generator.olafneumann.org/?sampleText=alain%20jorge%20acu%C3%B1a%20%7C%20ecf613ee-6a9a-436a-b617-4270fecf2197&flags=PWLi&selection=0%7CCombination%20%5BMultiple%20characters%20%2B%20Character%5D,20%7CCombination%20%5BAlphanumeric%20characters%20%2B%20Character%5D,18%7CCharacter,19%7COne%20whitespace,17%7COne%20whitespace,16%7COne%20arbitrary%20character
    //       //https://regex101.com/
    //       this.VerificaPatronEstructura(resultadoBreakLine, file);

    //       if (!this.abortTxtProcessing) {
    //         let resultadoTuberia: string[] = [];
    //         // const resultado = fileContent.split(/\r?\n/); //txt files
    //         resultadoBreakLine.map((item) =>
    //           resultadoTuberia.push(item.split('|').toString())
    //         );
    //         //https://stackoverflow.com/questions/69854460/convert-array-to-json-in-typescript
    //         //convertimos el array de resultado en un objeto compatible con el tipo que recibe el endpoint correspondiente
    //         // this.certificadosCliente = resultadoBreakLine.map((el) => ({
    //         //   certificate_id: el,
    //         // }));
    //         this.certificadosCliente = resultadoTuberia.map((el) => ({
    //           certificate_id: el.split(',')[1],
    //           name: el.split(',')[0],
    //         }));
    //         //Solo mostraremos el listado previo de certificados a importar, si el límite del plan lo permite
    //         if (!this.CompararContraLimiteCertificadosPlan(limit, file)) {
    //           //Asignamos al datasource del mat-table el resultado del procesamiento del fichero .txt
    //           this.setCertificadosDataSource();
    //           this.hiddenTableCertificados = false;
    //         }
    //         file = new File([], '');
    //       }
    //     }
    //   })();
    // } else {
    //   Swal.fire(
    //     // `Ha ocurrido el siguiente error`,
    //     // `El fichero ${file.name} tiene extensión no permitida o el nombre no se corresponde con el patrón permitido.`,
    //     // 'error'
    //     {
    //       title: '¡Ha ocurrido el siguiente error!',
    //       html: `El fichero ${file.name} tiene extensión no permitida o el nombre no se corresponde con el patrón permitido.`,
    //       icon: 'error',
    //       confirmButtonText: 'Aceptar',
    //       ...commonConfig,
    //     }
    //   );
    // }
    //according to https://stackoverflow.com/questions/42410531/xml-data-parsing-in-angular-2/45067926#45067926
    // parseString(file, function (err, result) {
    //   // var k: string | number,
    //   //   arr: any[] = [];
    //   // var obj = result.Employee;
    //   // for (k in obj.emp) {
    //   //   var item = obj.emp[k];
    //   //   arr.push({
    //   //     id: item.id[0],
    //   //     name: item.name[0],
    //   //     email: item.email[0],
    //   //   });
    //   // }
    //   // console.log(result);
    // });
    // file = new File([], '');
  }

  /**
   * Description
   * @returns {any}
   *  */
  private setCertificadosDataSource() {
    // this.dataSourceCertificados = new MatTableDataSource<any>(
    //   this.certificadosCliente
    // );
    this.dataSourceCertificados.data = this.certificadosCliente;
    //this.dataSourceCertificados.paginator = this.paginator;
    // console.log(this.paginator);

    // setTimeout(() => {
    //   this.dataSourceCertificados.paginator = this.paginator;
    // });
    // this.dataSourceCertificados.filterPredicate = (data, filter: string) => {
    //   const accumulator = (currentTerm: any, key: any) => {
    //     return nestedFilterCheck(currentTerm, data, key);
    //   };
    //   const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
    //   // Transform the filter by converting it to lowercase and removing whitespace.
    //   const transformedFilter = filter.trim().toLowerCase();
    //   return dataStr.indexOf(transformedFilter) !== -1;
    // };
  }

  /**
   * Description: Verifica line by line, que la estructura del fichero de certificados de cliente se correcta (nombre | id).
   * @param {string[]} resultadoBreakLine
   * @param {File} file
   * @returns {any}
   *  */
  private VerificaPatronEstructura(resultadoBreakLine: string[], file: File) {
    resultadoBreakLine.map((item) => {
      if (!useRegex(item)) {
        this.formAsociarValid = true;
        this.abortTxtProcessing = true;
        Swal.fire(
          // `Ha ocurrido el siguiente error`,
          // `El Fichero ${file.name} tiene errores. Rectifique la línea siguiente: <br /> <strong>${item}<strong>`,
          // 'error'
          {
            title: '¡Ha ocurrido el siguiente error!',
            html: `El Fichero ${file.name} tiene errores. Rectifique la línea siguiente: <br /> <strong>${item}<strong>`,
            icon: 'error',
            confirmButtonText: 'Aceptar',
            ...commonConfig,
          }
        );
      }
    });
  }

  /**
   * Description: Compara total de certificados contenidos en fichero de cliente, contra límite de certificados permitidos en el plan.
   * @param {number} limit
   * @param {File} file
   * @returns {boolean}
   *  */
  private CompararContraLimiteCertificadosPlan(
    limit: number,
    file: File | null
  ): boolean {
    if (this.files!.length > limit) {
      this.formAsociarValid = true;
      Swal.fire(
        // `Ha ocurrido el siguiente error`,
        // `El fichero ${file.name} tiene un total de ${this.certificadosCliente.length} certificados que excede el límite de certificados permitidos en este plan. Este plan solo admite un total de ${limit} certificados por cliente.`,
        // 'error'
        {
          title: '¡Ha ocurrido el siguiente error!',
          html: `Ha seleccionado un total de ${this.files!.length
            } certificados que excede el límite de certificados permitidos en este plan. Este plan solo admite un total de ${limit} certificados por cliente.`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          ...commonConfig,
        }
      );
      //return true to stop processing txt file
      return true;
    } else {
      this.formAsociarValid = false;
      return false;
    }
  }

  /**
   * Description: Valida que la extensión de cada fichero cargado sea permitida por el sistema
   * @param {string} fileName
   * @returns {any}
   *  */
  validate_fileupload(fileName: string): boolean {
    //var allowed_extensions = new Array('crt');

    var allowed_extensions: Array<string>;
    allowed_extensions = ['crt', 'cert'];

    var file_extension = fileName.split('.').pop()!.toLowerCase(); // split function will split the filename by dot(.), and pop function will pop the last element from the array which will give you the extension as well. If there will be no extension then it will return the filename.

    for (var i = 0; i <= allowed_extensions.length; i++) {
      if (
        allowed_extensions[i] == file_extension
        // && fileName === 'certificados.txt'
      ) {
        return true; // valid file extension
      }
    }

    // if (fileName === 'certificados.txt') return true; // valid file extension

    return false;
  }

  // /**
  //  * Description: Function para leer contenido de fichero seleccionado
  //  * @param {File} file
  //  * @returns {any}
  //  *  */
  // readFileContent(file: File): Promise<string> {
  //   return new Promise<string>((resolve, reject) => {
  //     if (!file) {
  //       resolve('');
  //     }

  //     const reader = new FileReader();

  //     reader.onload = (e) => {
  //       const text = reader.result!.toString();
  //       resolve(text);
  //     };

  //     reader.readAsText(file);
  //   });
  // }

  //store xml data into array variable
  // parseXML(data: any) {
  //   return new Promise((resolve) => {
  //     var k: string | number,
  //       arr: any[] = [],
  //       // parser = new xml2js.Parser({
  //       //   trim: true,
  //       //   explicitArray: true,
  //       // });
  //     parseString(data, function (err: any, result: any) {
  //       var obj = result.Employee;
  //       for (k in obj.emp) {
  //         var item = obj.emp[k];
  //         arr.push({
  //           id: item.id[0],
  //           name: item.name[0],
  //           email: item.email[0],
  //         });
  //       }
  //       resolve(arr);
  //     });
  //   });
  // }

  /**
   * Description: Function para hacer persistente la relación plan, cliente y certificados!
   * @returns {any}
   *  */
  SaveChagesAsociar(_planId: number): void {
    // console.log(_planId);
    const planCliente: planClienteAsociacion = {
      clienteId: this.getClientesIdSelected(),
      planId: _planId,
    } as planClienteAsociacion;

    const clienteCertificados: clienteCertificadosAsociacion = {
      idClient: this.getClientesIdSelected(),
      certificadoDtoList: this.certificadosCliente,
    };

    const asociacion: planClienteCertificadoAsociacion = {
      planId: _planId,
      clientId: this.getClientesIdSelected(),
      certificadoDtoList: this.certificadosCliente,
    };

    this.service.crearAsociacion(asociacion).subscribe(
      (res) => {
        // console.log(res);
        Swal.fire('Asociación creada con exito!', res.mensaje, 'success');
      },
      (err: HttpErrorResponse) => {
        handlerResponseError(err);
      }
    );
    // console.log(clienteCertificados);

    // const certificadoClient:

    // console.log(planCliente);
    // this.service.addClientToPlan(planCliente).subscribe(
    //   (res) => {
    //     console.log(res);
    //     Swal.fire('Asociación creada con exito!', res.mensaje, 'success');
    //   },
    //   (err: HttpErrorResponse) => {
    //     if (err.error instanceof Error) {
    //       //A client-side or network error occurred.
    //       console.log('An error occurred:', err.error.message);
    //       Swal.fire(
    //         'Ha ocurrido el siguiente error!',
    //         err.error.message,
    //         'error'
    //       );
    //     } else {
    //       //Backend returns unsuccessful response codes such as 404, 500 etc.
    //       console.log('Backend returned status code: ', err.status);
    //       console.log('Response body:', err.error);
    //       Swal.fire(
    //         'Ha ocurrido el siguiente error!',
    //         err.status + err.error.message,
    //         'error'
    //       );
    //     }
    //   }
    // );

    // this.service.addCertificatesToClient(clienteCertificados).subscribe(
    //   (res) => {
    //     console.log(res);
    //     Swal.fire('Asociación creada con exito!', res.mensaje, 'success');
    //   },
    //   (err: HttpErrorResponse) => {
    //     if (err.error instanceof Error) {
    //       //A client-side or network error occurred.
    //       console.log('An error occurred:', err.error.message);
    //       Swal.fire(
    //         'Ha ocurrido el siguiente error!',
    //         err.error.message,
    //         'error'
    //       );
    //     } else {
    //       //Backend returns unsuccessful response codes such as 404, 500 etc.
    //       console.log('Backend returned status code: ', err.status);
    //       console.log('Response body:', err.error);
    //       Swal.fire(
    //         'Ha ocurrido el siguiente error!',
    //         err.status + err.error.message,
    //         'error'
    //       );
    //     }
    //   }
    // );

    this.modalRef?.hide();
  }

  /**
   * Description
   * @param {FormGroup} formGroup
   * @returns {any}
   *  */
  validateAllFormFields(formGroup: FormGroup) {
    //{1}
    Object.keys(formGroup.controls).forEach((field) => {
      //{2}
      const control = formGroup.get(field); //{3}
      if (control instanceof FormControl) {
        //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        //{5}
        this.validateAllFormFields(control); //{6}
      }
    });
  }

  /**
   * Description: Function para verificar disponibilidad de nombre de plan
   * @param {Event} event
   * @returns {any}
   *  */
  checkNombreAvailability(event: Event) {
    let name = (event.target as HTMLInputElement).value;
    if (name.toString() != '') {
      let result = this.service.items$.value.filter(
        (item: Plan) => item.nombre.toUpperCase() === name.toUpperCase()
      );
      // console.log(result.length);
      if (result.length === 1) {
        this.form.controls['nombre'].setErrors({ incorrect: true });
        this.nombreFieldErrorMsg = `El nombre de plan <strong>${name}</strong> ya ha sido especificado previamente, por favor, especifique uno diferente.`;
      } else {
        this.nombreFieldErrorMsg = 'Nombre de Plan requerido ';
      }
    }
  }

  /**
   * Description
   * @param {string} path
   * @param {Plan} item
   * @returns {any}
   *  */
  NavigateToDetalles(item: Plan): void {
    this.router.navigate(['/dashboard/plan/detalles', item.id]);
  }

  openModalAssociationDialog(entry: Plan): void {

    let config: MatDialogConfig = {
      disableClose: false,
      hasBackdrop: false,
      width: 'auto',
      height: '',
      position: {
        top: '',
        bottom: '',
        left: '',
        right: ''
      },
      data: { entity: entry }
    };
    let dialogRef = this.dialog.open(AssociatePlanDialogComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      this.selectedItemCliente = [];
      this.disableImp = true;
      this.fileInfo = '';
      this.formAsociarValid = true;
      this.hiddenTableCertificados = true;
      }
    });
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
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
  
}
