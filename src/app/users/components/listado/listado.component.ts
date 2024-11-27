import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { User } from '../../interfaces/user.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { UsersService } from '../../services/users.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { MustMatch } from '../../../utils/must-match.validator';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AssignersService } from '../../../assigners/services/assigners.service';
import {
  commonConfig,
  esRangeLabel,
  handlerResponseError,
  removeItem,
} from '../../../utils/common-configs';
import { ValidatorFn } from '@angular/forms';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ClientesService } from 'src/app/clientes/services/clientes.service';
import { Cliente } from 'src/app/clientes/interfaces/clientes.interface';
import { Rol } from 'src/app/roles/interfaces/rol.interface';
import { finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TableColumn } from 'src/app/shared/components/mat-reusable-table/mat-reusable-table.interface';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateUserDialogComponent } from '../create-user-dialog/create-user-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

// import custom validator to validate that password and confirm password fields match

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
  displayedColumns = ['username', 'email', 'inuse', 'clienteName', 'userRole', 'actions'];
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  filter: string = "";
  searchIcon: string = "";
  clearIconColor: string = "";
  isLoadingResults: boolean = false;
  order?: Sort;

  nameFieldErrorMsg: string = 'Correo electrónico requerido';
  result: Cliente[] = [];
  //dropdownList section
  dropdownList: Rol[] = [];
  dropdownListClientes: Cliente[] = [];
  dropdownSettingsClientes: IDropdownSettings = {};
  selectedItems: any = [];
  selectedItemCliente: any = [];
  dropdownSettings: IDropdownSettings = {};

  //variables utilizadas en el modal de listar permisos asignados al rol
  selectedRol!: User;
  titlePermisosModal: string = '';
  listadoPermisosAsignadosModal: any[] = [];

  public userList!: Observable<User[]>;
  private _userList!: BehaviorSubject<User[]>;

  isLoading: Subject<boolean> = this.loader.isLoading;
  UsuariosList!: any[];
  usuariosTableColumns!: TableColumn[];
  errorResponse!: HttpErrorResponse;
  //Referencia al modal del create/update item
  modalRef?: BsModalRef;

  form!: FormGroup;

  p: number = 1;
  pModalPermisos: number = 1;

  searchText = '';

  /**
   * Description: Constructor de la clase
   * @param {BsModalService} modalService
   * @param {FormBuilder} fb
   * @param {UsersService} usersService
   * @param {LoadingService} loader
   *  */
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private usersService: UsersService,
    readonly service: AssignersService,
    readonly serviceClientes: ClientesService,
    private loader: LoadingService,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    public _MatPaginatorIntl: MatPaginatorIntl
  ) {
    this._userList = new BehaviorSubject<User[]>([]);
    this.userList = this._userList.asObservable();
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
    this._MatPaginatorIntl.itemsPerPageLabel = 'Usuarios por página:';
    this._MatPaginatorIntl.lastPageLabel = 'Ultima página';
    this._MatPaginatorIntl.nextPageLabel = 'Página siguiente';
    this._MatPaginatorIntl.previousPageLabel = 'Página anterior';
    this._MatPaginatorIntl.getRangeLabel = esRangeLabel;

    this.isAuthenticatedUser();
    this.initializeColumns();
    //Invocamos al servicio de roles para que este haga lo necesario y el listado de roles en nuestro control multiselect se llene de datos.
    this.service.fetchList();
    //Invocamos al servicio de clientes para obtener dichos items.
    this.usersService.fetchListClientes();
    //Obtenemos listado de usuarios existentes
    this.ObtenerListadoUsuarios();
    /* Construir el FormGroup(productForm), se usa el FormBuilder para facilitar la construccion del formulario(setear valores y validadores) */
    this.FormGroupInit();
    this.dropdownInit();
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
   * Description: Function para verificar disponibilidad de username tecleado por el usuario
   * @param {Event} event
   * @returns {any}
   *  */
  checkUserAvailability(event: Event) {
    let username = (event.target as HTMLInputElement).value;
    if (username) {
      let result = this.UsuariosList.filter(
        (item: User) => item.username === username
      );
      // console.log(result.length);
      if (result.length === 1) {
        this.form.controls['name'].setErrors({ incorrect: true });
        this.nameFieldErrorMsg = `El usuario <strong>${username}</strong> ya ha sido especificado previamente`;
      } else {
        // this.form.controls['name'].setErrors(null);
        this.nameFieldErrorMsg = 'Usuario requerido, entre 8 y 20 caracteres';
      }
    }
  }

  getRolesParaAsignar(): void {
    // this.service.items.subscribe((data) => {
    //   if (data) {
    //     this.dropdownList = data;
    //     console.log(this.dropdownList);
    //   }
    // });
    // this.dropdownList = this.service.fetchList();
    // // this.dropdownInitClientes = this.serviceClientes.fetchListClientes();
    // console.log(this.dropdownList);
  }

  /**
   * Description Inicializamos los valores del multiselect control para listar los permisos disponibles a asignar
   * @returns {any}
   *  */
  dropdownInit(): void {
    //Obtenemos listado de roles para asignar
    // this.getRolesParaAsignar();
    // this.service.fetchList();
    this.service.items.subscribe(
      (data) => {
        if (data) {
          this.dropdownList = data;
        }
      },
      (err: HttpErrorResponse) => {
        handlerResponseError(err);
      }
    );
    // console.log(this.dropdownList);
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Marcar todos',
      unSelectAllText: 'Desmarcar todos',
      allowSearchFilter: true,
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
  dropdownInitClientes(): void {
    this.usersService.itemsClientes$.subscribe(
      (data) => {
        if (data) {
          // console.log(data);
          //Ya no es necesario filtrar para obtener los clientes que no tienen asignado un usuario, ya que
          //ahora la lógica cambió, un cliente puede tener asignado más de un usuario.
          // //Buscamos solamente los clientes que no tienen usuario asociado!
          // data.map((item: Cliente) => {
          //   // if (item.usuario.length === 0)
          //     // item.usuario.includes
          //     item.usuario.forEach((element) => {
          //       if (!this.result.find(element.username.toString))
          //         this.result.push(item);
          //     });
          //     this.result.push(item);
          // });
          //Asignamos solamente los clientes que no tienen usuario asociado!
          var uniq = [...new Set(data)];
          // console.log('Unicos ' + uniq);
          this.dropdownListClientes = uniq;
        }
      },
      (err: HttpErrorResponse) => {
        handlerResponseError(err);
      }
    );
    // this.usersService.fetchListClientes.subscribe((data) => {
    //   if (data) {
    //     this.dropdownListClientes = data;
    //   }
    // });
    // console.log(this.dropdownListClientes);
    this.dropdownSettingsClientes = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
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
  onItemSelect(item: any) {
    // console.log(item);
    this.selectedItems = [];
    this.selectedItems.push(item);
    // console.log(this.selectedItems);
  }

  /**
   * Description
   * @param {any} item
   * @returns {any}
   *  */
  onItemSelectCliente(item: any) {
    this.selectedItemCliente = [];
    this.selectedItemCliente.push(item);
    // console.log(this.selectedItemCliente);
    // this.form.get('email').setValue(item.name);
    //contactEmail property;
    const client = this.dropdownListClientes.find(
      (item) => item.name === this.selectedItemCliente[0].name
    );
    //Asignamos el valor del email del cliente seleccionado al campo email
    this.form.get('email')!.setValue(client!.contactEmail);
  }

  /**
   * Description
   * @param {any} item
   * @returns {any}
   *  */
  onItemDeSelectCliente(item: any) {
    removeItem(this.selectedItemCliente, item);
    this.selectedItemCliente = [];
    // console.log(this.selectedItemCliente);
    //Asignamos empty value al campo email
    this.form.get('email')!.setValue('');
  }

  // /**
  //  * Description: Elimina un item de un array
  //  * https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
  //  * @param {Array<T>} arr
  //  * @param {T} value
  //  * @returns {any}
  //  *  */
  // removeItem<T>(arr: Array<T>, value: T): Array<T> {
  //   const index = arr.indexOf(value);
  //   if (index > -1) {
  //     arr.splice(index, 1);
  //   }
  //   return arr;
  // }

  /**
   * Description
   * @param {any} item
   * @returns {any}
   *  */
  onItemDeSelect(item: any) {
    // const index1 = this.selectedItems.findIndex((element: any) => {
    //   return element.id === item.id;
    // });
    // this.selectedItems.splice(index1, 1);
    removeItem(this.selectedItems, item);
    // console.log(this.selectedItems);
  }

  /**
   * Description
   * @param {any} items
   * @returns {any}
   *  */
  onSelectAll(items: any) {
    //
    this.selectedItems.push(items);
    // console.log(this.selectedItems);
  }

  /**
   * Description
   * @param {any} items
   * @returns {any}
   *  */
  onItemDeSelectAll(items: any) {
    //
    this.selectedItems = [];
    // console.log(this.selectedItems);
  }

  /**
   * Description: Function para initializar columnas del listado de clientes API
   * @returns {any}
   *  */
  private initializeColumns(): void {
    this.usuariosTableColumns = [
      {
        name: 'Nombre de usuario',
        dataKey: 'username',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Correo Electrónico',
        dataKey: 'email',
        position: 'left',
        isDate: true,
        isSortable: false,
      },
      {
        name: 'Estado',
        dataKey: 'inuse',
        position: 'left',
        isDate: true,
        isSortable: true,
        isBooleable: true,
      },
      {
        name: 'Cliente asociado',
        dataKey: 'clienteName',
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

  /**
   * Description: Function para obtener listado de usuarios
   * @returns {any}
   *  */
  private ObtenerListadoUsuarios(): void {

    this.isLoadingResults = true;

    if (this.filter == "") {
      this.searchIcon = "search";
    }
    else {
      this.searchIcon = "clear";
    }

    this.usersService.getListadoUsuarios().subscribe({
      next: (response) => {
        this.isLoadingResults = false;
        this.UsuariosList = response.map((item: User) => ({
          id: item.id,
          username: item.username,
          email: item.email,
          inuse: item.inuse,
          clientResponse: item.clientResponse ? item.clientResponse : null,
          userRole: item.userRole,
          clienteName: item.clientResponse ? item.clientResponse.name : null,
        }));
        
        this.dataSource.data = this.UsuariosList
        this._userList.next(response);
      },
      error: (e) => {
        console.error(e)
        handlerResponseError(e)
      },
      complete: () => console.info('complete')
    })
  }

  /**
   * Description: Function para inicializar el FormBuilder
   * @returns {any}
   *  */
  private FormGroupInit(): void {
    this.form = this.fb.group(
      {
        id: [''],
        name: [
          '',
          [
            Validators.required,
            // Validators.minLength(4),
            //https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username
            Validators.pattern(
              /^(?=[a-zA-ZñÑ0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
            ),
          ],
        ],
        // email: ['', [Validators.required, Validators.email]],
        email: [
          '',
          [
            Validators.required,
            //https://www.regexlib.com/Search.aspx?k=email&AspxAutoDetectCookieSupport=1
            Validators.pattern(
              /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
            ),
          ],
        ],
        password: ['', [Validators.required, Validators.min(0)]],
        confirmPassword: ['', Validators.required],
        roles: [''],
        cliente: ['', Validators.required],
      },
      {
        validators: MustMatch('password', 'confirmPassword'),
      }
    );
  }

  /**
   * Description Function para eliminar clientes api
   * @param {number} index: id del cliente api a eliminar
   * @returns {any}
   *  */
  deletedItem(item: User): void {
    let texto: string = '';
    item.inuse === 1
      ? (texto = `El usuario ${item.username} es un usuario activo del sistema`)
      : (texto = '');
    Swal.fire({
      title: `¿Está seguro de eliminar el usuario con identificador: ${item.username} ?`,
      text: `Este proceso es irreversible, preste mucha atención. ${texto}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'No, cancelar esta acción',
      ...commonConfig,
    }).then((result) => {
      if (result.value) {
        //TODO: incluir llamada a lógica del service correspondiente para eliminar lógicamente este item
        //TODO: y dentro del suscribe, manejamos el tipo de mensaje a retornar
        this.usersService.deletedItem(item).subscribe(
          (resp) => {
            // this._userList.next(resp.data);
            this.ObtenerListadoUsuarios();
            Swal.fire(
              // 'Eliminado!',
              // `El usuario con identificador ${item.id} ha sido eliminado correctamente`,
              // 'success'
              {
                title: '¡Eliminado!',
                html: `El usuario con identificador ${item.id} ha sido eliminado correctamente`,
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
          // '¡Eliminado!',
          // `El usuario con identificado ${item.username} ha sido eliminado correctamente`,
          // 'success'
          {
            title: '¡Eliminado!',
            html: `El usuario con identificado ${item.username} ha sido eliminado correctamente`,
            icon: 'success',
            ...commonConfig,
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
      }
    });
  }

  /**
   * Description: Modal para mostrar interfaz para las opciones create/update
   * @param {TemplateRef<any>} template
   * @param {User} user?
   * @returns {any}
   *  */
  openModal(template: TemplateRef<any>, user?: User) {
    // this.dropdownInitClientes();
    // this.usersService.fetchListClientes();
    if (user !== undefined) {
      //Asignamos los roles del user a modificar al array de selectedItems bindeado con el componente multiselect
      this.selectedItems = user.userRole;

      if (user.clientResponse) {
        this.selectedItemCliente = [
          {
            id: user.clientResponse.id,
            name: user.clientResponse.name,
          },
        ];
      }

      // updates form values if there is a user
      this.form.controls['name'].disable();
      this.form.controls['email'].disable();
      this.form.controls['password'].disable();
      this.form.controls['confirmPassword'].disable();
      this.form.patchValue({
        id: 1,
        name: user!.username,
        email: user!.email,
      });
    } else {
      this.form.controls['name'].enable();
      this.form.controls['email'].disable();
      // this.form.controls['email'].enable();
      this.form.controls['password'].enable();
      this.form.controls['confirmPassword'].enable();
      // reseteamos los valorees del array de selectedItems bindeado con el componente multiselect
      this.selectedItems = [];
      this.selectedItemCliente = [];
      // clears the form if there is no user
      this.form.reset();
    }
    // console.log(this.form.value.name);
    this.modalRef = this.modalService.show(template, {
      ignoreBackdropClick: true,
      keyboard: false,
      // class: 'modal-dialog-centered modal-dialog-scrollable',
      // class: 'modal-dialog-scrollable',
    });
    this.modalRef.onHide!.subscribe((reason: string | any) => {
      // reseteamos los valorees del array de selectedItems bindeado con el componente multiselect
      this.selectedItems = [];
      this.selectedItemCliente = [];
    });
  }

  /**
   * Description Obtener ids de permisos seleccionados, se utiliza en las acciones create/update
   * @returns {any}
   *  */
  getRolesIdSelected(): string[] {
    var ids: string[] = [];

    if (this.selectedItems.lenght === 0) {
      return ids;
    }

    for (let item of this.selectedItems) {
      ids.push(item.id);
    }

    //removemos duplicados
    let listadoIds = [...ids];
    // console.log(listadoIds);
    return listadoIds;
  }

  /**
   * Description
   * @param {TemplateRef<any>} template
   * @param {User}user?
   * @returns {any}
   *  */
  openModalPermisos(template: TemplateRef<any>, user?: User) {
    //Especificamos el nombre del modal
    this.titlePermisosModal = `Listado de roles asignados al usuario <strong>${user?.username}</strong>`;
    //Seteamos el listado de permisos asignados del rol, al listado definido como variable bindeada con el component.html.
    this.listadoPermisosAsignadosModal = user?.userRole!;
    //asignamos el rol seleccionado con el rol bindeado con el component.html
    this.selectedRol = user!;
    // console.log(this.form.value.name);
    this.modalRef = this.modalService.show(template);
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
        this.addUser();
      }
    }
    this.ObtenerListadoUsuarios();
    // this.addUser();
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
  private addUser() {
    const user: User = {
      username: this.form.value.name,
      // email: this.form.value.email
      email: this.form.controls['email'].value, //disable control!!
      password: this.form.value.password,
      listRoles: this.getRolesIdSelected(),
      usuarioId: this.selectedItemCliente[0].id,
      // enable: true,
    } as User;

    // console.log(user);
    this.usersService.addItem(user).subscribe(
      (resp) => {
        // resp.data = this.UsuariosList;
        // this._userList.next(resp.data);
        // console.log(resp.message);
        this.ObtenerListadoUsuarios();
        Swal.fire(
          // 'Usuario adicionado!',
          // `El usuario con identificador ${user.username} ha sido adicionado correctamente`,
          // 'success'
          {
            title: '¡Usuario adicionado!',
            html: `El usuario con identificador ${user.username} ha sido adicionado correctamente`,
            icon: 'success',
            ...commonConfig,
          }
        );
      },
      // (error) => {
      //   // console.log(error);
      //   Swal.fire({
      //     title: '¡Error adicionando usuario!',
      //     html:
      //       '<p>Ha ocurrido el siguiente error: <strong>' +
      //       error.message +
      //       '</strong></p>',
      //     icon: 'error',
      //     ...commonConfig,
      //   });
      // }
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          //A client-side or network error occurred.
          console.log('An error occurred:', err.error.message);
          Swal.fire(
            // 'Ha ocurrido el siguiente error!',
            // err.error.message,
            // 'error'
            {
              title: '¡Ha ocurrido el siguiente error!',
              html: ` ${err.error.message} `,
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
              // html: `Código de error: ${err.status}, ${err.error.message} `,
              html: `Error: <strong>${err.status}</strong>: <div style="text-align: justify;">${err.error.message}</div>. `,
              icon: 'error',
              confirmButtonText: 'Aceptar',
              ...commonConfig,
            }
          );
        }
      }
    );
    this.modalRef?.hide();
    //Reseteamos los valores del array de selectedItems
    this.selectedItems = [];
    this.selectedItemCliente = [];
  }

  /**
   * Description
   * @returns {any}
   *  */
  private updateRol() {
    const user: User = {
      // identifier: this.form.controls['identificador'].value,
      username: this.form.controls['name'].value,
      email: this.form.controls['email'].value, //disable control!!
      // email: this.form.email.getRawValue(),
      // password: this.form.value.password,
      listRoles: this.getRolesIdSelected(),
      usuarioId: this.selectedItemCliente[0].id,
    } as User;

    // console.log(user);
    // this.service.updateItem(rol).subscribe({
    //   next: (data) => {
    //     // this.service.updateItemLocalService(rol.id!, data);
    //     Swal.fire(
    //       '!Rol modificado!',
    //       `El rol con identificador ${rol.name} ha sido modificado correctamente`,
    //       'success'
    //     );
    //     // console.log(data);
    //   },
    //   error: (error) => {
    //     console.log(error);
    //     Swal.fire(
    //       'Error adicionando rol!',
    //       `Ha ocurrido el siguiente error ${error}`,
    //       'error'
    //     );
    //   },
    // });
    this.modalRef?.hide();
  }

  openModalUserDialog(entry: any | null): void {

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
      autoFocus: false,
      data: { entity: entry }
    };
    let dialogRef = this.dialog.open(CreateUserDialogComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ObtenerListadoUsuarios()
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

roles(items: any): string {
  var sum = "";
  for (let item of items) {
      sum = sum.concat(', ', item.name);
  }
  return sum.replace(/^,\s*/, '');
}

}
