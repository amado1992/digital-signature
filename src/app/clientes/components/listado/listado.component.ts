import { Component, OnInit, TemplateRef, AfterViewInit, ViewChild } from '@angular/core';
import { Subject, BehaviorSubject, Observable, tap, debounceTime } from 'rxjs';
import {
  DatoBancario,
  Cliente,
  DatoBancarioCliente,
  denom,
} from '../../interfaces/clientes.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ClientesService } from '../../services/clientes.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { delay } from 'rxjs/internal/operators/delay';

import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { paisesListado } from '../../../utils/paises';
import {
  commonConfig,
  esRangeLabel,
  handlerResponseError,
} from 'src/app/utils/common-configs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ViewportScroller } from '@angular/common';

import { Router } from '@angular/router';
import { PlanService } from 'src/app/plan/services/plan.service';
import { removeItem } from '../../../utils/common-configs';
import { checkEmailAvailability } from '../../utils/validaciones-fields';
import { User } from 'src/app/users/interfaces/user.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TableColumn } from '../../../shared/components/mat-reusable-table/mat-reusable-table.interface';
import { Plan } from 'src/app/plan/interfaces/plan';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ClientCertificatesDialogComponent } from '../../client-certificates/client-certificates-dialog.component';

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
  displayedColumns = ['name', 'lastName', 'nombreCorto', 'codigoReeup', 'contactEmail', 'contactPhone', 'country', 'province', 'institutional', 'description', 'actions'];
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  filter: string = "";
  searchIcon: string = "";
  clearIconColor: string = "";
  isLoadingResults: boolean = false;
  order?: Sort;

  //Para modal de cuentas bancarias
  titleCuentasBancariasModal: string = '';
  listadoCuentasBancariasAsignadosModal: DatoBancario[] = [];
  selectedClient!: Cliente;
  //Para modal de usuarios asociados
  titleUsuariosAsociadosModal: string = '';
  listadoUsuariosAsociadosModal: User[] = [];
  //Para modal de certificados asociados
  titleCertificadosAsociadosModal: string = '';
  listadoCertificadosAsociadosModal: any[] = [];
  p: number = 1;
  pModalCuentasBancarias: number = 1;
  pModalUsuariosAsociados: number = 1;
  pModalCertificadosAsociados: number = 1;

  emailFieldErrorMsg: string = 'Usuario requerido, entre 8 y 20 caracteres';
  cuentaBancariaFieldErrorMsg: string = 'Cuenta bancaria requerida';
  ciFieldErrorMsg: string = 'CI/Pasaporte requerido';
  telefonoFieldErrorMsg: string = 'Teléfono requerido';
  nombreFieldErrorMsg: string = 'Nombre requerido';
  nombreCortoFieldErrorMsg: string = 'Nombre corto requerido';
  codigoFieldErrorMsg: string = 'Código REEUP requerido';

  disableTipoClienteDropdown: boolean = false;
  hiddenWizard: boolean = true;
  step1Hidden: boolean = true;
  step2Hidden: boolean = true;
  tipoCliente: string = 'Loremp ipsum';
  clienteNatural: boolean = false;
  clienteJuridico: boolean = false;
  dropdownListTipoCliente: any[] = [];
  selectedItemTipoCliente: any[] = [];
  dropdownSettingsTipoCliente: IDropdownSettings = {};
  dropdownListMonedas: any = [];
  selectedItemsMonedas: any = [];
  dropdownSettings: IDropdownSettings = {};

  // public clientList!: Observable<Cliente[]>;
  public _clientList!: BehaviorSubject<Cliente[]>;

  isLoading: Subject<boolean> = this.loader.isLoading;
  ClientesList!: Cliente[];
  clientesTableColumns!: TableColumn[];
  errorResponse!: HttpErrorResponse;
  //Referencia al modal del create/update item
  modalRef?: BsModalRef;

  // addForm!: FormGroup;
  // rows!: FormArray;
  componentForm!: FormGroup;

  selectedCountry: String = '';
  selectedProvince: String = '';
  Countries: Array<any> = paisesListado;
  //states: Array<any>; //Angular 8
  states: Array<any> = []; //Angular 11
  isChecked: boolean = false;
  cliente!: Cliente;

  // p: number = 1;
  searchText = '';

  /**
   * Description
   * @param {BsModalService} privatemodalService
   * @param {FormBuilder} privatefb
   * @param {ClientesService} privateclienteService
   * @param {PlanService} readonlyservice
   * @param {LoadingService} privateloader
   * @param {ViewportScroller} privateviewportScroller
   * @param {Router} privaterouter
   *  */
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private clienteService: ClientesService,
    readonly service: PlanService,
    private loader: LoadingService,
    private viewportScroller: ViewportScroller,
    private router: Router,
    private authService: AuthService,
    public _MatPaginatorIntl: MatPaginatorIntl,
    public dialog: MatDialog
  ) {
    this._clientList = new BehaviorSubject<Cliente[]>([]);
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
   * Description
   * @returns {any}
   *  */
  ngOnInit(): void {
    this.order = { active: "", direction: "" };
    this.filter = "";
    this.searchIcon = "search";
    this.clearIconColor = "";

    this._MatPaginatorIntl.firstPageLabel = 'Primera página';
    this._MatPaginatorIntl.itemsPerPageLabel = 'Clientes por página:';
    this._MatPaginatorIntl.lastPageLabel = 'Ultima página';
    this._MatPaginatorIntl.nextPageLabel = 'Página siguiente';
    this._MatPaginatorIntl.previousPageLabel = 'Página anterior';
    this._MatPaginatorIntl.getRangeLabel = esRangeLabel;

    this.isAuthenticatedUser();
    this.initializeColumns();
    this.obtenerListadoClientes();
    /* Construir el FormGroup(productForm), se usa el FormBuilder para facilitar la construccion del formulario(setear valores y validadores) */
    this.FormGroupInit();
    //Primeramente invocamos al método para listar las monedas, then
    this.service.fetchListMonedas();
    //Inicializamos el control dropdown con el listado de monedas
    this.dropdownInitMonedas();
    //Adicionamos un primer grupo para Datos Bancarios, ya despues queda a decisión del usuario si adiciona más grupos
    // this.onAddRow('', '', [{ id: 0, descripcion: 'USD' }], '', '', '');
    //Inicializamos el control dropdown con el listado de clientes
    this.dropdownInitClientes();
  }

  ngAfterViewInit() {

    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  initializeColumns(): void {
    this.clientesTableColumns = [
      {
        name: 'Nombre',
        dataKey: 'name',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Apellidos',
        dataKey: 'lastName',
        position: 'right',
        isSortable: false,
      },
      {
        name: 'Nombre Corto',
        dataKey: 'nombreCorto',
        position: 'right',
        isSortable: true,
      },
      {
        name: 'Código REEUP',
        dataKey: 'codigoReeup',
        position: 'right',
        isSortable: false,
      },
      {
        name: 'Correo Electrónico',
        dataKey: 'contactEmail',
        position: 'right',
        isSortable: false,
      },
      // {
      //   name: 'Usuario',
      //   dataKey: 'discount',
      //   position: 'right',
      //   isSortable: false,
      // },
      {
        name: 'Teléfono',
        dataKey: 'contactPhone',
        position: 'right',
        isSortable: false,
      },
      {
        name: 'País',
        dataKey: 'country',
        position: 'right',
        isSortable: false,
      },
      {
        name: 'Provincia',
        dataKey: 'province',
        position: 'right',
        isSortable: false,
      },
      {
        name: 'Institucional',
        dataKey: 'institutional',
        position: 'right',
        isSortable: false,
        isBooleable: true,
        isYesNoBooleable: true,
        // isCustomBooleable: true,
      },
      {
        name: 'Descripción',
        dataKey: 'description',
        position: 'right',
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

  /**
   * Description Inicializamos los valores del multiselect control para listar las monedas
   * @returns {any}
   *  */
  dropdownInitMonedas(): void {
    this.service.itemsMonedas$.subscribe(
      (data) => {
        if (data) {
          this.dropdownListMonedas = data;
          // console.log(data);
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
      closeDropDownOnSelection: true,
      allowSearchFilter: true,
      searchPlaceholderText: 'Buscar',
      noDataAvailablePlaceholderText: 'No se ha encontrado ningún resultado',
      noFilteredDataAvailablePlaceholderText:
        'No se ha encontrado ningún resultado',
    };
  }

  /**
   * Description
   * @param {any} item
   * @returns {any}
   *  */
  onItemSelectMoneda(item: any): any {
    // this.selectedItemsMonedas = [];
    // this.selectedItemsMonedas.push(item);
    // console.log(this.selectedItemsMonedas);
  }

  /**
   * Description
   * @param {any} item
   * @returns {any}
   *  */
  onItemDeSelectMoneda(item: any): any {
    // removeItem(this.selectedItemsMonedas, item);
    // console.log(this.selectedItemsMonedas);
  }

  /**
   * Description: Function onAddRow related to wizard client form
   * according to: https://stackblitz.com/edit/angular-prepopulate-dynamic-reactive-form-array-ufxsf9?file=src%2Fapp%2Fapp.component.ts (awesome sample)
   * @returns {any}
   *  */
  onAddRow(
    cuenta: string | null,
    titular: string | null,
    moneda: [{ id: number; descripcion: string }] | null,
    observs: string | null,
    banco: string | null,
    sucursal: string | null
  ): void {
    this.components().push(
      this.createItemFormGroup(
        cuenta,
        titular,
        moneda,
        observs,
        banco,
        sucursal
      )
    );
    // const f = this.componentForm;
    // f.updateValueAndValidity();
    // //Habilitamos o no, los campos de cada grupo de campos relacionados con Datos Bancarios, dependiendo del tipo de cliente seleccionado
    // this.clienteJuridico
    //   ? this.setClienteJuridicoRequiredFields
    //   : this.unsetClienteJuridicoRequiredFields;
  }

  /**
   * Description: Se obtiene un listado de los controles del array de Datos Bancarios
   * @returns {any}
   *  */
  components(): FormArray {
    return this.componentForm.get('definition')!.get('components') as FormArray;
  }

  /**
   * Description: Function onRemoveRow related to wizard client form
   * @param {number} rowIndex
   * @returns {any}
   *  */
  onRemoveRow(rowIndex: number): void {
    // this.rows.removeAt(rowIndex);
    this.components().removeAt(rowIndex);
  }

  /**
   * Description: Function createItemFormGroup related to wizard client form
   * https://nileshpatel17.github.io/ng-multiselect-dropdown/ set selected dropdown value
   * @returns {any}
   *  */
  createItemFormGroup(
    cuenta: string | null,
    titular: string | null,
    moneda: [{ id: number; descripcion: string }] | null,
    observs: string | null,
    banco: string | null,
    sucursal: string | null
  ): FormGroup {
    // console.log(moneda);
    return this.fb.group({
      cuenta: [
        cuenta,
        [
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(16),
          Validators.pattern(/^[0-9]*$/),
        ],
      ],
      titular: [
        titular,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern(/^[a-zA-ZñÑ\s]*$/),
        ],
      ],
      // moneda: [[{ id: 4, descripcion: 'GBP' }], [Validators.required]],
      moneda: [moneda, [Validators.required]],
      observaciones: [
        observs,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(200),
          ,
          Validators.pattern(
            /^[©a-zA-ZñÑ0-9\u0900-\u097f,\.\s\-\'\"!?\(\)\[\]]+$/
          ), //https://stackoverflow.com/questions/42082681/regex-validation-for-description-box#:~:text=Things%20allowed%3A%20alphabets%2C%20special%20characters%2C%20spaces%2C%20new%20line,this%20%5E%20%28.%7Cs%29%2A%20%5Ba-zA-Z%5D%2B%20%28.%7Cs%29%2A%24%20should%20help%20you
          //https://stackoverflow.com/questions/52564859/regex-validation-for-memo-field-client-and-server-side-with-few-special-tags
        ],
      ],
      banco: [
        banco,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern(/^[a-zA-ZñÑ\s]*$/),
        ],
      ],
      sucursal: [
        sucursal,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern(/^[a-zA-ZñÑ\s]*$/),
        ],
      ],
    });
  }

  /**
   * Description
   * @returns {any}
   *  */
  // getControls() {
  //   return (this.addForm.get('rows') as FormArray)?.controls;
  // }

  /**
   * According to https://stackoverflow.com/questions/67834802/template-error-type-abstractcontrol-is-not-assignable-to-type-formcontrol
   * Description
   * @param {AbstractControl|null} absCtrl
   * @returns {any}
   *  */
  convertToFormControl(absCtrl: AbstractControl | null): FormControl {
    const ctrl = absCtrl as FormControl;
    return ctrl;
  }

  public navigateToSection(section: string) {
    window.location.hash = '';
    window.location.hash = section;
  }

  NavigateTo(path: string): void {
    this.router.navigate([path]);
  }

  public onClick(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
    console.log(elementId);
  }

  /**
   * Description
   * @param {any} item
   * @returns {any}
   *  */
  onItemSelect(item: any) {
    // //reseteamos los valores de la selección para los controles País y Provincia/Estado
    // this.selectedCountry = 'Cuba';
    // //Invocamos el método para cargar los estados del selected country y garantizar así el flujo normal del formulario.
    // this.loadPaisCountrySelected('Cuba');
    // this.selectedProvince = 'La Habana';
    // clears the form if there is no user
    // Limpiamos todos los posibles valores previamente escritos en el form
    //this.componentForm.reset();
    // Visualizamos el primer tab de Datos Generales, sin importar que tipo de cliente haya sido seleccionado
    this.step1Hidden = false;
    // Visualizamos las opciones del wizard
    this.hiddenWizard = false;
    if (item.value === 'Cliente Natural') {
      this.tipoCliente = 'Natural';
      this.clienteNatural = true;
      this.clienteJuridico = false;
      this.unsetClienteJuridicoRequiredFields(new Array('nameCorto', 'codigo'));
      this.componentForm.get('nameCorto')!.reset();
      this.componentForm.get('codigo')!.reset();
    } else {
      this.tipoCliente = 'Juridico';
      this.clienteNatural = false;
      this.clienteJuridico = true;
      this.setClienteJuridicoRequiredFields(new Array('lastName', 'ci'));
      this.componentForm.get('lastName')!.reset();
      this.componentForm.get('ci')!.reset();
    }
    // console.log(this.tipoCliente);
  }

  /**
   * Description
   * @param {any} item
   * @returns {any}
   *  */
  onItemDeSelect(item: any) {
    // console.log(this.tipoCliente);
    // this.selectedItemTipoCliente = [];
    // this.tipoCliente = '';
    // this.clienteNatural = false;
    // this.clienteJuridico = false;
    // this.step1Hidden = true;
    // this.step2Hidden = true;
    // // Ocultamos las opciones del wizard
    // this.hiddenWizard = true;
    this.ResetValuesOnModalHide();
  }

  /**
   * Description Inicializamos los valores del multiselect control para listar los clientes
   * @returns {any}
   *  */
  dropdownInitClientes(): void {
    this.dropdownListTipoCliente = [
      { id: 1, value: 'Cliente Natural' },
      { id: 2, value: 'Cliente Jurídico' },
    ];
    this.dropdownSettingsTipoCliente = {
      singleSelection: true,
      idField: 'id',
      textField: 'value',
      allowSearchFilter: false,
      closeDropDownOnSelection: true,
      searchPlaceholderText: 'Buscar',
      noDataAvailablePlaceholderText: 'No se ha encontrado ningún resultado',
      noFilteredDataAvailablePlaceholderText:
        'No se ha encontrado ningún resultado',
    };
  }

  pillclick(event: Event): void {
    let filterValue = (event.target as HTMLElement).id;
    console.log(filterValue);
  }

  pillclick1(): void {
    // console.log('pill 1');
    this.step1Hidden = false;
    this.step2Hidden = true;
  }

  pillclick2(): void {
    // console.log('pill 2');
    this.step1Hidden = true;
    this.step2Hidden = false;
    // checkEmailAvailability();
  }

  /**
   * Description: Function para verificar disponibilidad de username tecleado por el usuario
   * @param {Event} event
   * @returns {any}
   *  */
  checkEmailAvailability(event: Event) {
    let email = (event.target as HTMLInputElement).value;
    let result = this.ClientesList.filter(
      (item: Cliente) => item.contactEmail === email
    );
    console.log(result.length);
    if (result.length === 1) {
      this.componentForm.controls['email'].setErrors({ incorrect: true });
      this.emailFieldErrorMsg = `El correo electrónico <strong>${email}</strong> ya ha sido especificado previamente para otro cliente, por favor, especifique uno diferente.`;
    } else {
      this.emailFieldErrorMsg = 'Correo electrónico requerido';
    }
  }

  /**
   * Description: Function para verificar disponibilidad del campo cuenta bancaria tecleado por el usuario
   * Pendiente por complegidad considerable!!!
   * @param {Event} event
   * @returns {any}
   *  */
  checkCuentaBancariaAvailability(event: Event) {
    let email = (event.target as HTMLInputElement).value;
    let result = this.ClientesList.filter(
      (item: Cliente) => item.contactEmail === email
    );
    console.log(result.length);
    if (result.length === 1) {
      this.componentForm.controls['cuenta'].setErrors({ incorrect: true });
      this.cuentaBancariaFieldErrorMsg = `La cuenta bancaria <strong>${email}</strong> ya ha sido especificado previamente para otro cliente, por favor, especifique una diferente.`;
    } else {
      this.cuentaBancariaFieldErrorMsg = 'Cuenta bancaria requerida';
    }
  }

  /**
   * Description: Function para verificar disponibilidad del campo CI/Pasaporte tecleado por el usuario
   * @param {Event} event
   * @returns {any}
   *  */
  checkCIAvailability(event: Event) {
    let ci = (event.target as HTMLInputElement).value;
    if (ci) {
      let result = this.ClientesList.filter(
        (item: Cliente) => item.identificador === Number(ci)
      );
      console.log(result.length);
      if (result.length === 1) {
        this.componentForm.controls['ci'].setErrors({ incorrect: true });
        this.ciFieldErrorMsg = `El CI/Pasaporte <strong>${ci}</strong> ya ha sido especificado previamente para otro cliente, por favor, especifique uno diferente.`;
      } else {
        this.ciFieldErrorMsg = 'CI/Pasaporte requerido';
      }
    }
  }

  /**
   * Description: Function para verificar disponibilidad de username tecleado por el usuario
   * @param {Event} event
   * @returns {any}
   *  */
  checkTelefonoAvailability(event: Event) {
    let contactPhone = (event.target as HTMLInputElement).value;
    if (contactPhone) {
      let result = this.ClientesList.filter(
        (item: Cliente) => item.contactPhone === contactPhone
      );
      console.log(result.length);
      if (result.length >= 1) {
        this.componentForm.controls['contactPhone'].setErrors({
          incorrect: true,
        });
        this.telefonoFieldErrorMsg = `El teléfono <strong>${contactPhone}</strong> ya ha sido especificado previamente para otro cliente, por favor, especifique uno diferente.`;
      } else {
        this.telefonoFieldErrorMsg = 'Teléfono requerido';
      }
    }
  }

  /**
   * Description: Function para verificar disponibilidad de username tecleado por el usuario
   * @param {Event} event
   * @returns {any}
   *  */
  checkNombreAvailability(event: Event) {
    let name = (event.target as HTMLInputElement).value;
    if (name.toString() != '') {
      //Condicionar esta validación, solamente si el cliente seleccionado es de tipo Jurídico
      if (this.tipoCliente === 'Juridico') {
        let result = this.ClientesList.filter(
          (item: Cliente) => item.name === name
        );
        console.log(result.length);
        if (result.length === 1) {
          this.componentForm.controls['name'].setErrors({ incorrect: true });
          this.nombreFieldErrorMsg = `El nombre <strong>${name}</strong> ya ha sido especificado previamente para otro cliente institucional, por favor, especifique uno diferente.`;
        } else {
          this.nombreFieldErrorMsg = 'Nombre requerido';
        }
      }
    }
  }

  /**
   * Description: Function para verificar disponibilidad de username tecleado por el usuario
   * @param {Event} event
   * @returns {any}
   *  */
  checkNombreCortoAvailability(event: Event) {
    let nombreCorto = (event.target as HTMLInputElement).value;
    if (nombreCorto.toString() != '') {
      let result = this.ClientesList.filter(
        (item: Cliente) => item.nombreCorto === nombreCorto
      );
      console.log(result.length);
      if (result.length === 1) {
        this.componentForm.controls['nameCorto'].setErrors({ incorrect: true });
        this.nombreCortoFieldErrorMsg = `El nombre corto <strong>${nombreCorto}</strong> ya ha sido especificado previamente para otro cliente, por favor, especifique uno diferente.`;
      } else {
        this.nombreCortoFieldErrorMsg = 'Nombre corto requerido';
      }
    }
  }

  /**
   * Description: Function para verificar disponibilidad de username tecleado por el usuario
   * @param {Event} event
   * @returns {any}
   *  */
  checkCodigoAvailability(event: Event) {
    let codigo = (event.target as HTMLInputElement).value;
    if (codigo) {
      let result = this.ClientesList.filter(
        (item: Cliente) => item.codigoReeup === codigo
      );
      console.log(result.length);
      if (result.length === 1) {
        this.componentForm.controls['codigo'].setErrors({ incorrect: true });
        this.codigoFieldErrorMsg = `El Código REEUP <strong>${codigo}</strong> ya ha sido especificado previamente para otro cliente, por favor, especifique uno diferente.`;
      } else {
        this.codigoFieldErrorMsg = 'Código REEUP requerido';
      }
    }
  }

  /**
   * Description Evento checked change del select País
   * @param {any} e
   * @returns {any}
   *  */
  onNativeChange(e: any) {
    this.isChecked = e.target.checked;
  }

  /**
   * Description
   * @param {any} country
   * @returns {any}
   *  */
  onPaisSelected(country: any) {
    this.states = paisesListado.find(
      (cntry: any) => cntry.name == country.target.value
    ).states; //Angular
    this.states.length > 0 && (this.selectedProvince = this.states[0].name);
  }

  /**
   * Description
   * @param {any} country
   * @returns {any}
   *  */
  loadPaisCountrySelected(country: any) {
    this.states = paisesListado.find(
      (cntry: any) => cntry.name == country
    ).states; //Angular 11
  }

  /**
   * Description
   * @returns {any}
   *  */
  private obtenerListadoClientes(): void {
    this.isLoadingResults = true;
    this.clienteService
      .getListadoClientes()
      .pipe(debounceTime(50000)).subscribe({
        next: (response) => {
          this.ClientesList = response;
          this.dataSource.data = this.ClientesList;
          this.isLoadingResults = false;
        },
        error: (e) => {
          this.isLoadingResults = false;
          console.error(e)
          handlerResponseError(e)
        },
        complete: () => console.info('complete')
      })
  }
  
  /**
   * According to https://stackblitz.com/edit/angular-ivy-dtnh2j?file=src%2Fapp%2Fapp.component.html (awesome sample!!!)
   * Description: Function para inicializar el FormBuilder
   * @returns {any}
   *  */
  private FormGroupInit(): void {
  let patternLetterAndSpaces = new RegExp(/^[a-zA-ZñÑ\s]*$/);
  this.componentForm = this.fb.group({
    id: [''],
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern(patternLetterAndSpaces), //letras y espacios
      ],
    ],
    lastName: [
      '',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern(patternLetterAndSpaces), //letras y espacios
      ],
    ],
    email: [
      '',
      [
        Validators.required,
        // Validators.minLength(1),
        // Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$/),
        Validators.email,
      ],
    ],
    contactPhone: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^[0-9]*$/),
      ],
    ],
    pais: ['', [Validators.required, Validators.minLength(4)]],
    provincia: ['', [Validators.required, Validators.minLength(4)]],
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
    // institucional: [''],
    tipoCliente: ['', Validators.required],
    nameCorto: [
      '',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern(patternLetterAndSpaces), //letras y espacios
      ],
    ],
    direccion: [
      '',
      [
        Validators.required,
        Validators.minLength(1),
        ,
        Validators.pattern(
          /^[©a-zA-ZñÑ0-9\u0900-\u097f,\.\s\-\'\"!?\(\)\[\]]+$/
        ), //https://stackoverflow.com/questions/42082681/regex-validation-for-description-box#:~:text=Things%20allowed%3A%20alphabets%2C%20special%20characters%2C%20spaces%2C%20new%20line,this%20%5E%20%28.%7Cs%29%2A%20%5Ba-zA-Z%5D%2B%20%28.%7Cs%29%2A%24%20should%20help%20you
        //https://stackoverflow.com/questions/52564859/regex-validation-for-memo-field-client-and-server-side-with-few-special-tags
      ],
    ],
    ci: [
      '',
      [
        Validators.required,
        Validators.minLength(11),
        Validators.pattern(/^[0-9]*$/),
      ],
    ],
    codigo: [
      '',
      [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(/^[a-zA-Z\s]*$/),
      ],
    ],
    definition: this.fb.group({
      //elementos del array de Datos Bancarios
      components: this.fb.array([]),
    }),
  });
}

  /**
   * Description: Seteamos las validaciones a los campos requeridos cuando el tipo de cliente es Jurídico, además se inhabilitan las validaciones
   * para los campos previamente seteados como requeridos cuando el tipo de cliente es Natural.
   * @returns {any}
   *  */
  private setClienteJuridicoRequiredFields(
  fieldsClientenatural: string[]
): void {
  //Habilitamos las validaciones a los campos de tipo Cliente Jurídico
  this.componentForm.controls['nameCorto'].setValidators([
    Validators.required,
    Validators.minLength(1),
    Validators.pattern(/^[a-zA-ZñÑ\s]*$/), //letras y espacios
  ]);
  this.componentForm.controls['codigo'].setValidators([
    Validators.required,
    Validators.minLength(4),
    Validators.pattern(/^[a-zA-Z\s]*$/),
  ]);
  //Datos Bancarios
  for(
    let index = 0;
    index <this.componentForm.value.definition.components.length;
  index++
    ) {
  this.components()
    .controls[index].get('cuenta')!
    .setValidators([
      Validators.required,
      Validators.minLength(16),
      Validators.maxLength(16),
      Validators.pattern(/^[0-9]*$/),
    ]);
  this.components()
    .controls[index].get('titular')!
    .setValidators([
      Validators.required,
      Validators.minLength(1),
      Validators.pattern(/^[a-zA-ZñÑ\s]*$/),
    ]);
  this.components()
    .controls[index].get('moneda')!
    .setValidators([Validators.required]);
  this.components()
    .controls[index].get('observaciones')!
    .setValidators([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(200),
      Validators.pattern(
        /^[©a-zA-ZñÑ0-9\u0900-\u097f,\.\s\-\'\"!?\(\)\[\]]+$/
      ),
    ]);
  this.components()
    .controls[index].get('banco')!
    .setValidators([
      Validators.required,
      Validators.minLength(4),
      Validators.pattern(/^[a-zA-ZñÑ\s]*$/),
    ]);
  this.components()
    .controls[index].get('sucursal')!
    .setValidators([
      Validators.required,
      Validators.minLength(4),
      Validators.pattern(/^[a-zA-ZñÑ\s]*$/),
    ]);
}

//Datos Bancarios
this.componentForm.controls['nameCorto'].updateValueAndValidity();
this.componentForm.controls['codigo'].updateValueAndValidity();
for (
  let index = 0;
  index < this.componentForm.value.definition.components.length;
  index++
) {
  this.components().controls[index].get('cuenta')!.updateValueAndValidity();
  this.components()
    .controls[index].get('titular')!
    .updateValueAndValidity();
  this.components().controls[index].get('moneda')!.updateValueAndValidity();
  this.components()
    .controls[index].get('observaciones')!
    .updateValueAndValidity();
  this.components().controls[index].get('banco')!.updateValueAndValidity();
  this.components()
    .controls[index].get('sucursal')!
    .updateValueAndValidity();
}
// Invalidamos las validaciones a los campos de tipo Cliente Natural
for (var i = 0; i < fieldsClientenatural.length; i++) {
  this.componentForm.controls[fieldsClientenatural[i]].setValidators(null);
  this.componentForm.controls[
    fieldsClientenatural[i]
  ].updateValueAndValidity();
}
  }

  private setDatosBancariosValidationsRequired(): void {
  // return this.componentForm.get('definition')!.get('components') as FormArray;
  this.componentForm.controls['banco']?.setValidators([
    Validators.required,
    Validators.minLength(4),
    Validators.pattern(/^[a-zA-Z\s]*$/),
  ]);
  this.componentForm.controls['banco']?.updateValueAndValidity();
  const f = this.componentForm;
  f.updateValueAndValidity();
}

  /**
   * Description: Invalidamos las validaciones a los campos requeridos cuando el tipo de cliente es Jurídico, además se habilitan las validaciones
   * para los campos previamente seteados como requeridos cuando el tipo de cliente es Natural.
   * @param {string[]} fields
   * @returns {any}
   *  */
  private unsetClienteJuridicoRequiredFields(
  fieldsClienteJuridico: string[]
): void {
  // Invalidamos las validaciones a los campos de tipo Cliente Jurídico
  for(
    let index = 0;
    index <this.componentForm.value.definition.components.length;
  index++
    ) {
  this.components().controls[index].get('cuenta')!.setValidators(null);
  this.components().controls[index].get('cuenta')!.updateValueAndValidity();
  this.components().controls[index].get('titular')!.setValidators(null);
  this.components()
    .controls[index].get('titular')!
    .updateValueAndValidity();
  this.components().controls[index].get('moneda')!.setValidators(null);
  this.components().controls[index].get('moneda')!.updateValueAndValidity();
  this.components()
    .controls[index].get('observaciones')!
    .setValidators(null);
  this.components()
    .controls[index].get('observaciones')!
    .updateValueAndValidity();
  this.components().controls[index].get('banco')!.setValidators(null);
  this.components().controls[index].get('banco')!.updateValueAndValidity();
  this.components().controls[index].get('sucursal')!.setValidators(null);
  this.components()
    .controls[index].get('sucursal')!
    .updateValueAndValidity();
}
for (var i = 0; i < fieldsClienteJuridico.length; i++) {
  this.componentForm.controls[fieldsClienteJuridico[i]].setValidators(null);
  this.componentForm.controls[
    fieldsClienteJuridico[i]
  ].updateValueAndValidity();
}
//Habilitamos las validaciones a los campos de tipo Cliente Natural
this.componentForm.controls['lastName'].setValidators([
  Validators.required,
  Validators.minLength(1),
  Validators.pattern(/^[a-zA-ZñÑ\s]*$/), //letras y espacios
]);
this.componentForm.controls['ci'].setValidators([
  Validators.required,
  Validators.minLength(11),
  Validators.pattern(/^[0-9]*$/),
]);
this.componentForm.controls['lastName'].updateValueAndValidity();
this.componentForm.controls['ci'].updateValueAndValidity();
  }

/**
 * Description Function para eliminar clientes api
 * @param {number} index: id del cliente api a eliminar
 * @returns {any}
 *  */
deletedItem(item: Cliente): void {
  Swal.fire({
    title: `¿Está seguro de eliminar el cliente con identificador: ${item.name} ${item?.lastName}  ?`,
    text: `Este proceso es irreversible, preste mucha atención.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, estoy seguro',
    cancelButtonText: 'No, cancelar esta acción',
  }).then((result) => {
    if (result.value) {
      //TODO: incluir llamada a lógica del service correspondiente para eliminar lógicamente este item
      //TODO: y dentro del suscribe, manejamos el tipo de mensaje a retornar
      this.clienteService.deletedItem(item).subscribe(
        (resp) => {
          // this._clientList.next(resp);
          this.obtenerListadoClientes();
          Swal.fire(
            // 'Eliminado!',
            // `El cliente con identificador ${item.id} ha sido eliminado correctamente`,
            // 'success'
            {
              title: '¡Eliminado!',
              html: `El cliente con nombre ${item.name} ha sido eliminado correctamente`,
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
      Swal.fire(
        // 'Eliminado!',
        // `El cliente con identificador ${item.name} ${item.lastName} ha sido eliminado correctamente`,
        // 'success'
        {
          title: '¡Eliminado!',
          html: `El cliente con nombre ${item.name} ${item.lastName} ha sido eliminado correctamente`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          ...commonConfig,
        }
      );
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // Swal.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
    }
  });
}

/**
 * Description
 * @param {TemplateRef<any>} template
 * @param {Cliente} client?
 * @returns {any}
 *  */
openModal(template: TemplateRef<any>, client ?: Cliente) {
  // this.addForm.addControl('rows', this.rows);
  if (client !== undefined) {
    this.disableTipoClienteDropdown = true;
    //Trabajamos con las banderas del wizard
    //Seteamos el tipo de cliente para el form update
    client.institutional
      ? (this.tipoCliente = 'Juridico')
      : (this.tipoCliente = 'Natural');
    //Seteamos el tipo de cliente para el control dropdown
    client.institutional
      ? (this.selectedItemTipoCliente = [
        { id: 2, value: 'Cliente Jurídico' },
      ])
      : (this.selectedItemTipoCliente = [
        { id: 1, value: 'Cliente Natural' },
      ]);
    //Especificamos los campos a inhabilitar dependiendo del tipo de cliente
    if (client.institutional) {
      this.tipoCliente = 'Juridico';
      this.clienteNatural = false;
      this.clienteJuridico = true;
      this.setClienteJuridicoRequiredFields(new Array('lastName', 'ci'));
    } else {
      this.tipoCliente = 'Natural';
      this.clienteNatural = true;
      this.clienteJuridico = false;
      this.unsetClienteJuridicoRequiredFields(
        new Array('nameCorto', 'codigo')
      );
    }
    //Eliminamos el grupo de datos previamente creado en el método onInit()
    // this.onRemoveRow(1);
    // Eliminamos todos los posibles Datos Bancarios previamente creados
    // https://stackoverflow.com/questions/56087761/foreach-is-not-a-function-on-fromarray-angular
    this.components()?.controls.forEach(() => {
      let index = 0;
      this.onRemoveRow(index);
      index++;
    });
    //Iteramos por cada item del array client.datosBancariosDtoList
    for (
      let index = 0;
      index < client.datosBancariosDtoList.length;
      index++
    ) {
      console.log([client.datosBancariosDtoList[index].monedas]);
      this.onAddRow(
        client.datosBancariosDtoList[index].cuentaBancaria,
        client.datosBancariosDtoList[index].titular,
        [client.datosBancariosDtoList[index].monedas],
        client.datosBancariosDtoList[index].observaciones,
        client.datosBancariosDtoList[index].nombreBanco,
        client.datosBancariosDtoList[index].sucursal
      );
    }
    //client.datosBancariosDtoList.length
    // this.clienteNatural = false;
    // this.clienteJuridico = false;
    //reseteamos el posible (posible porque el user puede no haber seleccionado nada) tipo de cliente seleccionado
    // this.selectedItemTipoCliente = [];
    // Restauramos las opciones del wizard
    this.step1Hidden = false;
    this.step2Hidden = true;
    // Ocultamos las opciones del wizard
    this.hiddenWizard = false;
    //Trabajamos con las banderas del wizard

    //Invocamos el método para cargar los estados del selected country y garantizar así el flujo normal del formulario.
    this.loadPaisCountrySelected(client.country);
    // updates form values if there is a user
    //seteamos el select country basándonos en la property country del cliente seleccionado
    this.selectedCountry = client.country;
    //seteamos el select country basándonos en la property province del cliente seleccionado
    this.selectedProvince = client.province;
    this.componentForm.patchValue({
      id: client.id,
      name: client.name,
      lastName: client.lastName ? client.lastName : '', //Puede venir null or empty, no aplica para los clientes jurídicos
      ci: client.identificador ? client.identificador : '', //Puede venir null or empty, no aplica para los clientes jurídicos
      email: client.contactEmail,
      contactPhone: client.contactPhone,
      nameCorto: client.nombreCorto ? client.nombreCorto : '', //Puede venir null or empty, no aplica para los clientes naturales
      codigo: client.codigoReeup ? client.codigoReeup : '', //Puede venir null or empty, no aplica para los clientes naturales
      institucional:
        client.institutional === true
          ? (this.isChecked = true)
          : (this.isChecked = false),
      descripcion: client.description,
      direccion: client.address,
    });
  } else {
    //Adicionamos un primer grupo para Datos Bancarios, ya despues queda a decisión del usuario si adiciona más grupos
    this.onAddRow('', '', [{ id: 0, descripcion: 'USD' }], '', '', '');
    //Adicionamos un primer grupo para Datos Bancarios, ya despues queda a decisión del usuario si adiciona más grupos
    // this.onAddRow('', '', [{ id: 0, descripcion: 'USD' }], '', '', '');
    //Habilitamos nuevamente el control dropdown para permitir la selección del tipo de cliente
    this.disableTipoClienteDropdown = false;
    //reseteamos los valores de la selección para los controles País y Provincia/Estado
    this.selectedCountry = 'Cuba';
    //Invocamos el método para cargar los estados del selected country y garantizar así el flujo normal del formulario.
    this.loadPaisCountrySelected('Cuba');
    this.selectedProvince = 'La Habana';
    // clears the form if there is no user
    this.componentForm.reset();
  }
  // console.log(this.form.value.name);
  this.modalRef = this.modalService.show(template, {
    ignoreBackdropClick: true,
    keyboard: false,
    // class: 'modal-dialog-centered modal-dialog-scrollable',
    // class: 'modal-dialog-scrollable',
  });
  this.modalRef.onHide!.subscribe((reason: string | any) => {
    this.ResetValuesOnModalHide();
  });
}

/**
 * Description
 * @param {TemplateRef<any>} template
 * @param {Rol} rol?
 * @returns {any}
 *  */
openModalDatosBancarios(template: TemplateRef<any>, client ?: Cliente) {
  //Especificamos el nombre del modal
  this.titleCuentasBancariasModal = `Cuentas Bancarias del cliente <strong>${client?.name}</strong>`;
  //Seteamos el listado de permisos asignados del rol, al listado definido como variable bindeada con el component.html.
  this.listadoCuentasBancariasAsignadosModal = client?.datosBancariosDtoList!;
  //asignamos el rol seleccionado con el rol bindeado con el component.html
  this.selectedClient = client!;
  //asignamos el rol seleccionado con el rol bindeado con el component.html
  // this.selectedRol = rol!;
  // console.log(this.form.value.name);
  this.modalRef = this.modalService.show(template, {
    ignoreBackdropClick: true,
    keyboard: false,
    // class: 'modal-dialog-centered modal-dialog-scrollable',
    // class: 'modal-dialog-scrollable',
  });
  this.modalRef.onHide!.subscribe((reason: string | any) => {
    this.pModalCuentasBancarias = 1;
    this.listadoCuentasBancariasAsignadosModal = [];
  });
}

/**
 * Description
 * @param {TemplateRef<any>} template
 * @param {Rol} rol?
 * @returns {any}
 *  */
openModalUsuariosAsociados(template: TemplateRef<any>, client ?: Cliente) {
  //Especificamos el nombre del modal
  this.titleUsuariosAsociadosModal = `Usuarios asociados al cliente <strong>${client?.name}</strong>`;
  //Seteamos el listado de permisos asignados del rol, al listado definido como variable bindeada con el component.html.
  this.listadoUsuariosAsociadosModal = client?.usuario!;
  //asignamos el rol seleccionado con el rol bindeado con el component.html
  this.selectedClient = client!;
  //asignamos el rol seleccionado con el rol bindeado con el component.html
  this.selectedClient = client!;
  this.modalRef = this.modalService.show(template, {
    ignoreBackdropClick: true,
    keyboard: false,
  });
  this.modalRef.onHide!.subscribe((reason: string | any) => {
    this.pModalUsuariosAsociados = 1;
    this.listadoUsuariosAsociadosModal = [];
  });
}

/**
 * Description
 * @param {TemplateRef<any>} template
 * @param {Rol} rol?
 * @returns {any}
 *  */
openModalCertificadosAsociados(template: TemplateRef<any>, client ?: Cliente) {
  this.service.getCertificatesClient(client?.id!).subscribe((resp) => {
    //Si en la respuesta, el objeto 'certificates' no es null, pues entonces asignamos la respuesta sino asignamos arreglo vacío ([])
    resp[0].clients[0].certificates
      ? (this.listadoCertificadosAsociadosModal =
        resp[0].clients[0].certificates)
      : [];
    // console.log(resp[0].clients[0].certificates);
  });
  //Especificamos el nombre del modal
  this.titleCertificadosAsociadosModal = `Certificados asociados al cliente <strong>${client?.name}</strong>`;
  //Seteamos el listado de permisos asignados del rol, al listado definido como variable bindeada con el component.html.
  // this.listadoUsuariosAsociadosModal = client?.usuario!;
  //asignamos el rol seleccionado con el rol bindeado con el component.html
  this.selectedClient = client!;
  this.modalRef = this.modalService.show(template, {
    ignoreBackdropClick: true,
    keyboard: false,
  });
  this.modalRef.onHide!.subscribe((reason: string | any) => {
    //Reiniciamos en 1 el valor de la variable identificadora del control del paginado, para que este se comporte
    //de modo correcto siempre que se visualice este modal.
    this.pModalCertificadosAsociados = 1;
    this.listadoCertificadosAsociadosModal = [];
  });
}

  /**
   * Description: Reseateamos los valores del wizard una vez que el form es cerrado por el user, mediante el btn cerrar.
   * @returns {any}
   *  */
  private ResetValuesOnModalHide(): void {
  // reseteamos los valores de las banderas que habilitan/deshabilitan las opciones del wizard
  this.step1Hidden = false;
  this.step2Hidden = true;
  // reseteamos los valores relacionados con el tipo de cliente a adicionan
  this.tipoCliente = '';
  this.clienteNatural = false;
  this.clienteJuridico = false;
  //reseteamos el posible (posible porque el user puede no haber seleccionado nada) tipo de cliente seleccionado
  this.selectedItemTipoCliente = [];
  // Ocultamos las opciones del wizard
  this.step1Hidden = true;
  this.step2Hidden = true;
  // Ocultamos las opciones del wizard
  this.hiddenWizard = true;
  // Eliminamos todos los posibles Datos Bancarios previamente creados
  // https://stackoverflow.com/questions/56087761/foreach-is-not-a-function-on-fromarray-angular
  // this.components()?.controls.forEach(() => {
  //   let index = 0;
  //   this.onRemoveRow(index);
  //   index++;
  // });
  //https://stackoverflow.com/questions/41852183/remove-all-items-from-a-formarray-in-angular (este si funciona)
  this.clearFormArray(this.components());
  //Y adicionamos un primer grupo para Datos Bancarios, ya despues queda a decisión del usuario si adiciona más grupos, de este modo
  //logramos dejar el formulario en su estado inicial.
  // this.onAddRow('', '', [{ id: 0, descripcion: 'USD' }], '', '', '');
}

/**
 * Description
 * https://stackoverflow.com/questions/41852183/remove-all-items-from-a-formarray-in-angular
 * @param {FormArray} formArray
 * @returns {any}
 *  */
clearFormArray = (formArray: FormArray) => {
  while (formArray.length !== 0) {
    formArray.removeAt(0);
  }
};

/**
 * Description
 * @returns {any}
 *  */
SaveChages(): void {
  // console.log(this.componentForm.value.id);
  if(this.componentForm.value.id !== null) {
  //TODO: Implementar mecanismo para lógica de update
  console.log('update');
  this.updateClient();
} else {
  if (this.componentForm.valid) {
    //  this.addUser();
    // console.log('create');
    this.addClient();
  }
}
this.obtenerListadoClientes();
  }

  /**
   * Description: Function para adicionar un cliente utilizando el servicio correspondiente.
   * @returns {any}
   *  */
  private addClient() {
  const cliente: Cliente = this.getClientFormData();
  let idcliente: number = 0;
  let idDatoBancario: number = 0;
  // console.log(this.componentForm.value.definition.components);

  this.clienteService.addItem(cliente).subscribe(
    (resp: Cliente) => {
      idcliente = resp.id!;
      console.log('Id cliente: ' + resp.id);
      //Refrescamos el listado de clientes, para mostrar el cliente recien adicionado
      setTimeout(() => this.obtenerListadoClientes(), 2000);
      //Mostramos notificación exitosa
      this.addClientNotification(cliente);
      //Procedemos entonces a adicionar los datos bancarios asociados a este cliente, al menos 1 tupla de este tipo tiene que venir asociada
      //Verificamos que al menos exista un dato bancario a adicionar, según la nueva lógica (17/05/2023) los clientes naturales
      //pueden prescindir de datos bancarios!
      if (this.componentForm.value.definition.components.length > 0) {
        for (
          var i = 0;
          i < this.componentForm.value.definition.components.length;
          i++
        ) {
          //TODO: Implementar la lógica en el servicio de clientes para asociar una cuenta bancaria con un cliente determinado
          const datoBancario: DatoBancario = {
            cuentaBancaria:
              this.componentForm.value.definition.components[i].cuenta,
            nombre: 'Nombre de cuenta bancaria',
            // nombre: this.componentForm.value.definition.components[i].nombre,
            titular:
              this.componentForm.value.definition.components[i].titular,
            observaciones:
              this.componentForm.value.definition.components[i].observaciones,
            monedas:
              this.componentForm.value.definition.components[i].moneda[0].id,
            nombreBanco:
              this.componentForm.value.definition.components[i].banco,
            sucursal:
              this.componentForm.value.definition.components[i].sucursal,
          } as DatoBancario;
          // console.log(datoBancario);
          this.clienteService
            .addCuentaBancariaToClient(datoBancario)
            .subscribe(
              (resp: any) => {
                // console.log('respuesta crear cuenta bancaria endpoint: ' + resp);
                console.log('Id cuenta bancaria: ' + resp.id);
                idDatoBancario = resp.id!;
                const itemAsociacion: DatoBancarioCliente = {
                  datoBancarioId: idDatoBancario,
                  clientId: idcliente,
                } as DatoBancarioCliente;

                console.log(itemAsociacion);
                this.clienteService
                  .asociarCuentaBancariaToClient(itemAsociacion)
                  .subscribe(
                    (resp: DatoBancarioCliente) => {
                      console.log('respuesta asociacion endpoint: ' + resp);
                    },
                    (err: HttpErrorResponse) => {
                      handlerResponseError(err);
                    }
                  );
              },
              (err: HttpErrorResponse) => {
                handlerResponseError(err);
              }
            );
        }
      }
    },
    (err: HttpErrorResponse) => {
      handlerResponseError(err);
    }
  );
  this.modalRef?.hide();
}

  /**
   * Description: Function para obtener los datos de los campos del formulario para create Cliente
   * @returns {any}
   *  */
  private getClientFormData(): Cliente {
  return {
    description: this.componentForm.value.descripcion,
    lastName: this.componentForm.value.lastName,
    name: this.componentForm.value.name,
    province: this.componentForm.value.provincia,
    address: this.componentForm.value.direccion,
    contactPhone: this.componentForm.value.contactPhone,
    contactEmail: this.componentForm.value.email,
    // institutional: this.isChecked ? true : false, //Rectificar
    institutional: this.clienteJuridico,
    country: this.componentForm.value.pais,
    nombreCorto: this.componentForm.value.nameCorto,
    codigoReeup: this.componentForm.value.codigo,
    telefono: this.componentForm.value.contactPhone,
    identificador: this.componentForm.value.ci,
    fechaCreacion: Date.now(),
    pais: 1,
    username: null
    // institutional: this.form.value.institucional,
  } as Cliente;
}

  // private getClientDatosBancariosFormData(): BatoBancario {
  //   return {} as DatoBancario;
  // }

  /**
   * Description: Function para mostrar mensaje de error luego de adicionar un cliente
   * @param {any} error
   * @returns {any}
   *  */
  private addClientNotificationError(error: any): void {
  Swal.fire({
    title: '¡Error adicionando cliente!',
    html: `Ha ocurrido el siguiente error ${error.message}`,
    icon: 'error',
    confirmButtonText: 'Aceptar',
    ...commonConfig,
  });
}

  /**
   * Description: Function para mostrar un mensaje satisfactorio luego de adicionar un cliente
   * @param {Cliente} cliente
   * @returns {any}
   *  */
  private addClientNotification(cliente: Cliente): void {
  Swal.fire({
    title: '¡Cliente adicionado!',
    html: `El cliente con nombre <strong>${cliente.name}</strong> ha sido adicionado correctamente`,
    icon: 'success',
    confirmButtonText: 'Aceptar',
    ...commonConfig,
  });
}

  /**
   * Description
   * @returns {any}
   *  */
  private updateClient() {
  let idcliente: number = 0;
  let idDatoBancario: number = 0;
  const user: Cliente = {
    id: this.componentForm.value.id,
    // name: this.componentForm.value.name,
    // lastName: this.componentForm.value.lastName,
    // contactEmail: this.componentForm.value.email,
    // contactPhone: this.componentForm.value.contactPhone,
    // country: this.componentForm.value.pais,
    // province: this.componentForm.value.provincia,
    // // institutional: this.form.value.institucional,
    // institutional: this.isChecked ? true : false,
    // description: this.componentForm.value.descripcion,
    description: this.componentForm.value.descripcion,
    lastName: this.componentForm.value.lastName,
    name: this.componentForm.value.name,
    province: this.componentForm.value.provincia,
    address: this.componentForm.value.direccion,
    contactPhone: this.componentForm.value.contactPhone,
    contactEmail: this.componentForm.value.email,
    // institutional: this.isChecked ? true : false, //Rectificar
    institutional: this.clienteJuridico,
    country: this.componentForm.value.pais,
    nombreCorto: this.componentForm.value.nameCorto,
    codigoReeup: this.componentForm.value.codigo,
    telefono: this.componentForm.value.contactPhone,
    identificador: this.componentForm.value.ci,
    fechaCreacion: Date.now(),
    pais: 1,
  } as Cliente;

  console.log(user);
  this.clienteService.updateItem(user).subscribe(
    (resp) => {
      idcliente = resp.id;
      //resp.data = this.ClientesList;
      // console.log(resp.message);
      // this._clientList.next(resp);
      //Refrescamos el listado de clientes, para mostrar el cliente recien adicionado
      this.obtenerListadoClientes();
      Swal.fire(
        // 'Cliente modificado!',
        // `El cliente con identificador ${user.name} ha sido modificado correctamente`,
        // 'success'
        {
          title: '¡Cliente modificado!',
          html: `El cliente con nombre ${resp.name} ha sido modificado correctamente`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          ...commonConfig,
        }
      );
      //Procedemos entonces a adicionar los datos bancarios asociados a este cliente, al menos 1 tupla de este tipo tiene que venir asociada
      //Verificamos que al menos exista un dato bancario a adicionar, según la nueva lógica (17/05/2023) los clientes naturales
      //pueden prescindir de datos bancarios!
      if (this.componentForm.value.definition.components.length > 0) {
        for (
          var i = 0;
          i < this.componentForm.value.definition.components.length;
          i++
        ) {
          //TODO: Implementar la lógica en el servicio de clientes para asociar una cuenta bancaria con un cliente determinado
          const datoBancario: DatoBancario = {
            cuentaBancaria:
              this.componentForm.value.definition.components[i].cuenta,
            nombre: 'Nombre de cuenta bancaria',
            // nombre: this.componentForm.value.definition.components[i].nombre,
            titular:
              this.componentForm.value.definition.components[i].titular,
            observaciones:
              this.componentForm.value.definition.components[i].observaciones,
            monedas:
              this.componentForm.value.definition.components[i].moneda[0].id,
            nombreBanco:
              this.componentForm.value.definition.components[i].banco,
            sucursal:
              this.componentForm.value.definition.components[i].sucursal,
          } as DatoBancario;
          // console.log(datoBancario);
          this.clienteService
            .addCuentaBancariaToClient(datoBancario)
            .subscribe(
              (resp: any) => {
                // console.log('respuesta crear cuenta bancaria endpoint: ' + resp);
                console.log('Id cuenta bancaria: ' + resp.id);
                idDatoBancario = resp.id!;
                const itemAsociacion: DatoBancarioCliente = {
                  datoBancarioId: idDatoBancario,
                  clientId: idcliente,
                } as DatoBancarioCliente;

                console.log(itemAsociacion);
                this.clienteService
                  .asociarCuentaBancariaToClient(itemAsociacion)
                  .subscribe(
                    (resp: DatoBancarioCliente) => {
                      console.log('respuesta asociacion endpoint: ' + resp);
                    },
                    (err: HttpErrorResponse) => {
                      handlerResponseError(err);
                    }
                  );
              },
              (err: HttpErrorResponse) => {
                handlerResponseError(err);
              }
            );
        }
      }
    },
    (err: HttpErrorResponse) => {
      handlerResponseError(err);
    }
  );
  this.modalRef?.hide();
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

openModalClientCertificatesDialog(entry: Cliente): void {

  let config: MatDialogConfig = {
    disableClose: false,
    hasBackdrop: false,
    width: '992px',
    height: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: ''
    },
    data: { entity: entry }
  };
  let dialogRef = this.dialog.open(ClientCertificatesDialogComponent, config);
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
    }
  });
}

}
