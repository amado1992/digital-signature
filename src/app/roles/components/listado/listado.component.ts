import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AssignersService } from 'src/app/assigners/services/assigners.service';
import Swal from 'sweetalert2';
import { Rol } from '../../interfaces/rol.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {
  commonConfig,
  esRangeLabel,
  handlerResponseError,
} from 'src/app/utils/common-configs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TableColumn } from 'src/app/shared/components/mat-reusable-table/mat-reusable-table.interface';
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
  pageSizeOptions: number[] = [2, 5, 10, 25, 100];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>()
  displayedColumns = ['name', 'status', 'description', 'actions'];
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  filter: string = "";
  searchIcon: string = "";
  clearIconColor: string = "";
  isLoadingResults: boolean = false;
  order?: Sort;
  
  nombreRolFieldErrorMsg: string = 'Nombre de Rol requerido ';
  //dropdownList section
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: IDropdownSettings = {};

  RolesList!: Rol[];
  rolesTableColumns!: TableColumn[];

  //Referencia al modal del create/update item
  modalRef?: BsModalRef;
  //variables utilizadas en el modal de listar permisos asignados al rol
  selectedRol!: Rol;
  titlePermisosModal: string = '';
  listadoPermisosAsignadosModal: any[] = [];

  form!: FormGroup;
  p: number = 1;
  pModalPermisos: number = 1;
  searchText = '';

  isChecked!: boolean;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    readonly service: AssignersService,
    private router: Router,
    private authService: AuthService,
    public _MatPaginatorIntl: MatPaginatorIntl
  ) {}

  /**
   * Description Inicializamos los valores del multiselect control para listar los permisos disponibles a asignar
   * @returns {any}
   *  */
  dropdownInit(): void {
    // this.dropdownList = [
    //   { id: 1, text: 'validateCertificate' },
    //   { id: 2, text: 'validateSignature' },
    //   { id: 3, text: 'checkCertificateStatus' },
    //   { id: 4, text: 'updateApiClientToken' },
    //   { id: 5, text: 'validateCertificateJSON' },
    //   { id: 6, text: 'validateCertificate' },
    //   { id: 7, text: 'validateSignature' },
    //   { id: 8, text: 'checkCertificateStatus' },
    //   { id: 9, text: 'updateApiClientToken' },
    //   { id: 10, text: 'updatePassword' },
    //   { id: 11, text: 'assignPermissionToRole' },
    //   { id: 12, text: 'assignPermissionToApiClient' },
    //   { id: 13, text: 'assignRolesToUser' },
    //   { id: 14, text: 'updateApiClient' },
    //   { id: 15, text: 'deleteApiClient' },
    //   { id: 16, text: 'listApiClient' },
    //   { id: 17, text: 'apiClient' },
    //   { id: 18, text: 'myDatesUser' },
    //   { id: 19, text: 'createClient' },
    //   { id: 20, text: 'deleteClient' },
    //   { id: 21, text: 'updateClient' },
    //   { id: 22, text: 'client' },
    //   { id: 23, text: 'listClient' },
    //   { id: 24, text: 'updateMyDates' },
    //   { id: 25, text: 'updateInUseMyDates' },
    //   { id: 26, text: 'getUser' },
    //   { id: 27, text: 'listUser' },
    //   { id: 28, text: 'role' },
    //   { id: 29, text: 'listRoles' },
    //   { id: 30, text: 'deleteRole' },
    //   { id: 31, text: 'updateRole' },
    //   { id: 32, text: 'createRole' },
    //   { id: 33, text: 'deleteUser' },
    //   { id: 34, text: 'ultimaActualizacion' },
    //   { id: 35, text: 'createActualizacion' },
    //   { id: 36, text: 'updateActualizacion' },
    //   { id: 37, text: 'deleteActualizacion' },
    //   { id: 38, text: 'listActualizacion' },
    //   { id: 39, text: 'countApiClient' },
    //   { id: 40, text: 'listPlan' },
    //   { id: 41, text: 'deletePlan' },
    //   { id: 42, text: 'updatePlan' },
    //   { id: 43, text: 'createPlan' },
    //   { id: 44, text: 'confirmarPago' },
    //   { id: 45, text: 'countClient' },
    //   { id: 46, text: 'countUser' },
    //   { id: 47, text: 'updateUserRole' },
    //   { id: 48, text: 'process_register' },
    //   { id: 49, text: 'verify' },
    //   { id: 50, text: 'validateSoftelCertificate' },
    //   { id: 51, text: 'signFileWithVisualSignature' },
    //   { id: 52, text: 'signFileWithVisualSignatureUnsafe' },
    //   { id: 53, text: 'signFileUnsafe' },
    //   { id: 54, text: 'signEncryptedFile' },
    //   { id: 55, text: 'signEncryptedFileWithVisualSignature' },
    //   { id: 56, text: 'signEncryptedFileWithVisualSignatureUnsafe' },
    //   { id: 57, text: 'signEncryptedFileUnsafe' },
    //   { id: 58, text: 'getCertificateInfo' },
    // ];
    this.service.itemsPermisos$.subscribe(
      (data) => {
        if (data) {
          // var uniq = [...new Set(data)];
          // this.dropdownList = uniq;
          //Modificamos tanto la estructura como el nombre de las propiedades de cada objeto para poder asignarlos al control
          //dropdown que lista clientes, la propiedad "nombre" se renombra por "text".
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
   * Description
   * @param {any} item
   * @returns {any}
   *  */
  onItemSelect(item: any) {
    // console.log(item);
    this.selectedItems.push(item);
    console.log(this.selectedItems);
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

  onItemDeSelect(item: any) {
    // const index1 = this.selectedItems.findIndex((element: any) => {
    //   return element.id === item.id;
    // });
    // this.selectedItems.splice(index1, 1);
    this.removeItem(this.selectedItems, item);
    console.log(this.selectedItems);
  }

  /**
   * Description
   * @param {any} items
   * @returns {any}
   *  */
  onSelectAll(items: any) {
    //
    this.selectedItems.push(items);
    console.log(this.selectedItems);
  }

  onItemDeSelectAll(items: any) {
    //
    this.selectedItems = [];
    console.log(this.selectedItems);
  }

  // Recommended technique using the async pipe in the template
  // With this technique, no ngOnInit is required.
  // items$ = this.service.allItems$;

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
    this._MatPaginatorIntl.itemsPerPageLabel = 'Roles por página:';
    this._MatPaginatorIntl.lastPageLabel = 'Ultima página';
    this._MatPaginatorIntl.nextPageLabel = 'Página siguiente';
    this._MatPaginatorIntl.previousPageLabel = 'Página anterior';
    this._MatPaginatorIntl.getRangeLabel = esRangeLabel;
    
    this.isAuthenticatedUser();
    this.initializeColumns();
    this.isChecked = true;
    //Obtenemos el listado de roles
    this.service.fetchList();
    //Obtenemos el listado de permisos y lo asignamos a la property this.RolesList, mejorable totalmente en un futuro!!!
    this.listadoRoles();
    //Obtenemos el listado de operationTypes
    this.service.fetchListPermisos();
    // console.log(this.service.itemsPermisos$.value);
    console.log(this.service.items$.value);
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
  private listadoRoles(): void {
    this.isLoadingResults = true;
    this.service.fetchListObservable().subscribe((resp) => {
      this.RolesList = resp;
      this.isLoadingResults = false;
      this.dataSource.data = this.RolesList
    });
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
   * Description: Function para initializar columnas del listado de Roles
   * @returns {any}
   *  */
  private initializeColumns(): void {
    this.rolesTableColumns = [
      {
        name: 'Nombre',
        dataKey: 'name',
        position: 'left',
        isSortable: false,
      },
      {
        name: 'Estado',
        dataKey: 'status',
        position: 'left',
        isSortable: false,
        isBooleable: true,
      },
      {
        name: 'Descripción',
        dataKey: 'description',
        position: 'left',
        isSortable: false,
      },
    ];
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
   * Description: Function para inicializar el FormBuilder
   * @returns {any}
   *  */
  private FormGroupInit(): void {
    this.form = this.fb.group({
      id: [''],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern(/^[a-zA-ZñÑ,]+$/), //Solo letras
        ],
      ],
      denom: [
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
      permisos: [''],
      estado: [''],
    });
  }

  /**
   * Description Function para eliminar clientes api
   * @param {number} index: id del cliente api a eliminar
   * @returns {any}
   *  */
  deletedItem(item: Rol): void {
    let texto: string = '';
    // item.inuse === 1
    //   ? (texto = `El rol ${item.name} es un rol activo del sistema`)
    //   : (texto = '');
    Swal.fire({
      title: `¿Está seguro de eliminar el rol con identificador: ${item.name} ?`,
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
            //Obtenemos el listado de roles, remover esta línea cuando se este utilizando el observable en el listado
            //Actualizamos el listado con los datos nuevos después de cada operación de eliminación.
            // this.service.fetchListObservable().subscribe((resp) => {
            //   this.RolesList = resp;
            // });
            this.listadoRoles();
            //this.ObtenerListadoUsuarios();
            Swal.fire(
              // 'Eliminado!',
              // `El rol con identificador ${item.name} ha sido eliminado correctamente`,
              // 'success'
              {
                title: '¡Eliminado!',
                html: `El rol con identificador <strong>${item.name}</strong> ha sido eliminado correctamente.`,
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
          html: `El rol con identificador <strong>${item.name}</strong> ha sido eliminado correctamente.`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          ...commonConfig,
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
      }
    });
  }

  objectKeys(objeto: any[]) {
    const keys = Object.keys(objeto);
    console.log(keys); // echa un vistazo por consola para que veas lo que hace "Object.keys"
    return keys;
  }

  /**
   * Description: Modal para mostrar interfaz para las opciones create/update
   * @param {TemplateRef<any>} template
   * @param {User} user?
   * @returns {any}
   *  */
  openModal(template: TemplateRef<any>, rol?: Rol) {
    if (rol !== undefined) {
      //Asignamos los permisos del rol a modificar al array de selectedItems bindeado con el componente multiselect
      this.selectedItems = rol.operationTypes;
      this.isChecked = rol.status ? true : false;
      // updates form values if there is a user
      this.form.patchValue({
        id: rol.id,
        name: rol.name,
        denom: rol.description,
        estado: rol.status ? true : false,
      });
    } else {
      // reseteamos los valorees del array de selectedItems bindeado con el componente multiselect
      this.selectedItems = [];
      this.isChecked = true;
      this.form.reset();
    }
    // console.log(this.form.value.name);
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
  openModalPermisos(template: TemplateRef<any>, rol?: Rol) {
    //Especificamos el nombre del modal
    this.titlePermisosModal = `Listado de permisos asignados al rol <strong>${rol?.name}</strong>`;
    //Seteamos el listado de permisos asignados del rol, al listado definido como variable bindeada con el component.html.
    this.listadoPermisosAsignadosModal = rol?.operationTypes!;
    //asignamos el rol seleccionado con el rol bindeado con el component.html
    this.selectedRol = rol!;
    // console.log(this.form.value.name);
    this.modalRef = this.modalService.show(template, {
      ignoreBackdropClick: true,
      keyboard: false,
      // class: 'modal-dialog-centered modal-dialog-scrollable',
      // class: 'modal-dialog-scrollable',
    });
    this.modalRef.onHide!.subscribe((reason: string | any) => {
      this.pModalPermisos = 1;
    });
  }

  /**
   * Description
   * @returns {any}
   *  */
  SaveChages(): void {
    // console.log(this.form.value.id);
    if (this.form.value.id !== null) {
      //TODO: Implementar mecanismo para lógica de update
      this.updateRol();
      // console.log('update');
    } else {
      if (this.form.valid) {
        // console.log('create');
        this.addRol();
      }
    }
    //Obtenemos el listado de roles, remover esta línea cuando se este utilizando el observable en el listado
    //Actualizamos el listado con los datos nuevos después de cada operación de adición/edición.
    //Obtenemos el listado de roles, remover esta línea cuando se este utilizando el observable en el listado
    //Actualizamos el listado con los datos nuevos después de cada operación de eliminación.
    // this.service.fetchListObservable().subscribe((resp) => {
    //   this.RolesList = resp;
    // });
    this.listadoRoles();
  }

  /**
   * Description Obtener ids de permisos seleccionados, se utiliza en las acciones create/update
   * @returns {any}
   *  */
  getPermisosIdSelected(): string[] {
    var ids: string[] = [];

    if (this.selectedItems.lenght === 0) {
      return ids;
    }

    for (let item of this.selectedItems) {
      ids.push(item.id);
    }

    return ids;
  }

  /**
   * Description
   * @returns {any}
   *  */
  private addRol() {
    const rol: Rol = {
      name: this.form.value.name,
      description: this.form.value.denom,
      operationTypes: this.getPermisosIdSelected(), //Todo: falta por implementar lógica de negocio para incluir los permisos que un rol determinado puede tener.
      status: true,
    } as Rol;

    // console.log(user);
    this.service.addItem(rol);
    this.modalRef?.hide();
    //Reseteamos los valores del array de selectedItems
    this.selectedItems = [];
  }

  /**
   * Description
   * @returns {any}
   *  */
  private updateRol() {
    const rol: Rol = {
      id: this.form.value.id,
      name: this.form.value.name,
      description: this.form.value.denom,
      operationTypes: this.getPermisosIdSelected(), //Todo: falta por implementar lógica de negocio para incluir los permisos que un rol determinado puede tener.
      status: this.isChecked,
    } as Rol;

    // console.log(user);
    this.service.updateItem(rol).subscribe({
      next: (data) => {
        this.service.updateItemLocalService(rol.id!, data);
        Swal.fire(
          // '!Rol modificado!',
          // `El rol con identificador ${rol.name} ha sido modificado correctamente`,
          // 'success'
          {
            title: '¡Rol modificado!',
            html: `El rol con identificador <strong>${rol.name}</strong> ha sido modificado correctamente.`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            ...commonConfig,
          }
        );
        // console.log(data);
      },
      error: (err: HttpErrorResponse) => {
        handlerResponseError(err);
      },
    });
    this.modalRef?.hide();
  }

  /**
   * Description: Function para verificar disponibilidad de nombre de rol
   * @param {Event} event
   * @returns {any}
   *  */
  checkNomnbreRolAvailability(event: Event) {
    let name = (event.target as HTMLInputElement).value;
    if (name) {
      let result = this.service.items$.value.filter(
        (item: Rol) => item.name === name
      );
      console.log(result.length);
      if (result.length === 1) {
        this.form.controls['name'].setErrors({ incorrect: true });
        this.nombreRolFieldErrorMsg = `El nombre de rol <strong>${name}</strong> ya ha sido especificado previamente, por favor, especifique uno diferente.`;
      } else {
        this.nombreRolFieldErrorMsg = 'Nombre de Rol requerido ';
      }
    }
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
