import { Component, OnInit, TemplateRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Subject, BehaviorSubject, Observable, tap, debounceTime } from 'rxjs';
import {
  DatoBancario,
  Cliente,
  DatoBancarioCliente,
  denom,
  CreateUser,
} from '../../clientes/interfaces/clientes.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ClientesService } from '../../clientes/services/clientes.service';
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
  FormGroupDirective,
} from '@angular/forms';
import { paisesListado } from '../../utils/paises';
import {
  commonConfig,
  handlerResponseError,
} from 'src/app/utils/common-configs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ViewportScroller } from '@angular/common';

import { Router } from '@angular/router';
import { PlanService } from 'src/app/plan/services/plan.service';
import { removeItem } from '../../utils/common-configs';
import { checkEmailAvailability } from '../../clientes/utils/validaciones-fields';
import { User } from 'src/app/users/interfaces/user.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TableColumn } from '../../shared/components/mat-reusable-table/mat-reusable-table.interface';
import { Plan } from 'src/app/plan/interfaces/plan';
import { validPassword, whiteSpaces } from 'src/app/utils/validation-forms';


@Component({
  selector: 'app-client-common',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss'],
})
export class CreateClientComponent implements OnInit, AfterViewInit {
  registerForm: any;
  fieldRequired: string = "This field is required"

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


  public _clientList!: BehaviorSubject<Cliente[]>;

  isLoading: Subject<boolean> = this.loader.isLoading;
  ClientesList!: Cliente[];
  clientesTableColumns!: TableColumn[];
  errorResponse!: HttpErrorResponse;

  modalRef?: BsModalRef;


  componentForm!: FormGroup;

  selectedCountry: String = '';
  selectedProvince: String = '';
  Countries: Array<any> = paisesListado;

  states: Array<any> = [];
  isChecked: boolean = false;
  cliente!: Cliente;

  searchText = '';

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private clienteService: ClientesService,
    readonly service: PlanService,
    private loader: LoadingService,
    private viewportScroller: ViewportScroller,
    private router: Router,
    private authService: AuthService,
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
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    //document.body.classList.add('class-body');
    this.selectedCountry = 'Cuba';
    this.selectedProvince = 'La Habana';
    this.loadPaisCountrySelected('Cuba');
    //this.obtenerListadoClientes()
    this.createForm()
    this.isAuthenticatedUser();
    this.FormGroupInit();
  }

  createForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.registerForm = new FormGroup(
      {
        'username': new FormControl(null, [Validators.required]),
        'email': new FormControl(null, [Validators.required, Validators.pattern(emailregex)]),
        'password': new FormControl(null, [Validators.required, this.checkPassword]),
      }
    )


  }
  emaiErrors() {
    return this.registerForm.get('email').hasError('required') ? 'This field is required' :
      this.registerForm.get('email').hasError('pattern') ? 'Not a valid emailaddress' : ''
  }
  checkPassword(control: any) {
    let enteredPassword = control.value
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }
  getErrorPassword() {
    return this.registerForm.get('password').hasError('required') ? 'This field is required (The password must be at least six characters, one uppercase letter and one number)' :
      this.registerForm.get('password').hasError('requirements') ? 'Password needs to be at least six characters, one uppercase letter and one number' : '';
  }
  checkValidation(input: string) {
    const validation = this.registerForm.get(input).invalid && (this.registerForm.get(input).dirty || this.registerForm.get(input).touched)
    return validation;
  }
  onSubmit(formData: FormGroup, formDirective: FormGroupDirective): void {

    const email = formData.value.email;
    const password = formData.value.password;
    const username = formData.value.username;

    formDirective.resetForm();
    this.registerForm.reset();
  }

  /**
   * Description: Function para verificar disponibilidad de username tecleado por el usuario
   * @param {Event} event
   * @returns {any}
   *  */
  checkEmailAvailability(event: Event) {
    /*let email = (event.target as HTMLInputElement).value;
    let result = this.ClientesList.filter(
      (item: Cliente) => item.contactEmail === email
    );
    
    if (result.length === 1) {
      this.componentForm.controls['email'].setErrors({ incorrect: true });
      this.emailFieldErrorMsg = `El correo electrónico <strong>${email}</strong> ya ha sido especificado previamente para otro cliente, por favor, especifique uno diferente.`;
    } else {
      this.emailFieldErrorMsg = 'Correo electrónico requerido';
    }*/
  }

  /**
   * Description: Function para verificar disponibilidad del campo cuenta bancaria tecleado por el usuario
   * Pendiente por complegidad considerable!!!
   * @param {Event} event
   * @returns {any}
   *  */
  checkCuentaBancariaAvailability(event: Event) {
    /*let email = (event.target as HTMLInputElement).value;
    let result = this.ClientesList.filter(
      (item: Cliente) => item.contactEmail === email
    );
    
    if (result.length === 1) {
      this.componentForm.controls['cuenta'].setErrors({ incorrect: true });
      this.cuentaBancariaFieldErrorMsg = `La cuenta bancaria <strong>${email}</strong> ya ha sido especificado previamente para otro cliente, por favor, especifique una diferente.`;
    } else {
      this.cuentaBancariaFieldErrorMsg = 'Cuenta bancaria requerida';
    }*/
  }

  /**
   * Description: Function para verificar disponibilidad del campo CI/Pasaporte tecleado por el usuario
   * @param {Event} event
   * @returns {any}
   *  */
  checkCIAvailability(event: Event) {
    /*let ci = (event.target as HTMLInputElement).value;
    if (ci) {
      let result = this.ClientesList.filter(
        (item: Cliente) => item.identificador === Number(ci)
      );
      
      if (result.length === 1) {
        this.componentForm.controls['ci'].setErrors({ incorrect: true });
        this.ciFieldErrorMsg = `El CI/Pasaporte <strong>${ci}</strong> ya ha sido especificado previamente para otro cliente, por favor, especifique uno diferente.`;
      } else {
        this.ciFieldErrorMsg = 'CI/Pasaporte requerido';
      }
    }*/
  }

  /**
   * Description: Function para verificar disponibilidad de username tecleado por el usuario
   * @param {Event} event
   * @returns {any}
   *  */
  checkTelefonoAvailability(event: Event) {
    /*let contactPhone = (event.target as HTMLInputElement).value;
    if (contactPhone) {
      let result = this.ClientesList.filter(
        (item: Cliente) => item.contactPhone === contactPhone
      );
      
      if (result.length >= 1) {
        this.componentForm.controls['contactPhone'].setErrors({
          incorrect: true,
        });
        this.telefonoFieldErrorMsg = `El teléfono <strong>${contactPhone}</strong> ya ha sido especificado previamente para otro cliente, por favor, especifique uno diferente.`;
      } else {
        this.telefonoFieldErrorMsg = 'Teléfono requerido';
      }
    }*/
  }

  /**
   * Description: Function para verificar disponibilidad de username tecleado por el usuario
   * @param {Event} event
   * @returns {any}
   *  */
  checkNombreAvailability(event: Event) {
    /*let name = (event.target as HTMLInputElement).value;
    if (name.toString() != '') {
      //Condicionar esta validación, solamente si el cliente seleccionado es de tipo Jurídico
      if (this.tipoCliente === 'Juridico') {
        let result = this.ClientesList.filter(
          (item: Cliente) => item.name === name
        );
        
        if (result.length === 1) {
          this.componentForm.controls['name'].setErrors({ incorrect: true });
          this.nombreFieldErrorMsg = `El nombre <strong>${name}</strong> ya ha sido especificado previamente para otro cliente institucional, por favor, especifique uno diferente.`;
        } else {
          this.nombreFieldErrorMsg = 'Nombre requerido';
        }
      }
    }*/
  }

  /**
   * Description: Function para verificar disponibilidad de username tecleado por el usuario
   * @param {Event} event
   * @returns {any}
   *  */
  checkNombreCortoAvailability(event: Event) {
    /*let nombreCorto = (event.target as HTMLInputElement).value;
    if (nombreCorto.toString() != '') {
      let result = this.ClientesList.filter(
        (item: Cliente) => item.nombreCorto === nombreCorto
      );
      
      if (result.length === 1) {
        this.componentForm.controls['nameCorto'].setErrors({ incorrect: true });
        this.nombreCortoFieldErrorMsg = `El nombre corto <strong>${nombreCorto}</strong> ya ha sido especificado previamente para otro cliente, por favor, especifique uno diferente.`;
      } else {
        this.nombreCortoFieldErrorMsg = 'Nombre corto requerido';
      }
    }*/
  }

  /**
   * Description: Function para verificar disponibilidad de username tecleado por el usuario
   * @param {Event} event
   * @returns {any}
   *  */
  checkCodigoAvailability(event: Event) {
    /*let codigo = (event.target as HTMLInputElement).value;
    if (codigo) {
      let result = this.ClientesList.filter(
        (item: Cliente) => item.codigoReeup === codigo
      );

      if (result.length === 1) {
        this.componentForm.controls['codigo'].setErrors({ incorrect: true });
        this.codigoFieldErrorMsg = `El Código REEUP <strong>${codigo}</strong> ya ha sido especificado previamente para otro cliente, por favor, especifique uno diferente.`;
      } else {
        this.codigoFieldErrorMsg = 'Código REEUP requerido';
      }
    }*/
  }

  onPaisSelected(country: any) {
    this.states = paisesListado.find(
      (cntry: any) => cntry.name == country.target.value
    ).states;
    this.states.length > 0 && (this.selectedProvince = this.states[0].name);
  }

  loadPaisCountrySelected(country: any) {
    this.states = paisesListado.find(
      (cntry: any) => cntry.name == country
    ).states;
  }


   FormGroupInit(): void {
    let patternLetterAndSpaces = new RegExp(/^[a-zA-ZñÑ\s]*$/);
    this.componentForm = this.fb.group({
      id: [''],
      password: ['', [Validators.required, whiteSpaces, validPassword]],
      confirmpassword: ['', [Validators.required, whiteSpaces, validPassword]],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern(patternLetterAndSpaces), //letras y espacios
        ],
      ],
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
      province: ['', [Validators.required, Validators.minLength(4)]],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern(
            /^[©a-zA-ZñÑ0-9\u0900-\u097f,\.\s\-\'\"!?\(\)\[\]]+$/
          ),
        ],
      ],

      nameCorto: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern(patternLetterAndSpaces), //letras y espacios
        ],
      ],
      address: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          ,
          Validators.pattern(
            /^[©a-zA-ZñÑ0-9\u0900-\u097f,\.\s\-\'\"!?\(\)\[\]]+$/
          ),
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
      ]
    });
  }

  get password() {
    return this.componentForm.get('password');
  }

  get confirmpassword() {
    return this.componentForm.get('confirmpassword');
  }

  /**
   * Description
   * @returns {any}
   *  */
  SaveChages(): void {
    //if (this.componentForm.valid) {
      this.addClient();
    //}
  }

  /**
   * Description: Function para adicionar un cliente utilizando el servicio correspondiente.
   * @returns {any}
   *  */
  addClient() {
    
    const cliente: Cliente = this.getClientFormData();
    
    this.clienteService.addItem(cliente).subscribe(
      (resp: any) => {
        const user = this.getClientFormDataUser(resp.id);

        this.clienteService.addItemUser(user).subscribe(
          (respUser: any) => {
            
            this.addClientNotification(resp)
          },
          (err: HttpErrorResponse) => {
            
            this.addClientNotificationError(err.error)
          }
        );
        this.addClientNotification(resp)
        this.router.navigate(['/login']);
      },
      (err: HttpErrorResponse) => {
        
        this.addClientNotificationError(err.error)
      }
    );
  }


   getClientFormData(): Cliente {
    return {
      //description: this.componentForm.value.description,//no
      lastName: this.componentForm.value.lastName,//ok
      name: this.componentForm.value.name,//ok
      province: this.componentForm.value.province,//ok
      address: this.componentForm.value.address,//ok
      contactPhone: this.componentForm.value.contactPhone,//ok
      contactEmail: this.componentForm.value.email,//ok

      institutional: false,
      country: this.componentForm.value.pais,//ok
      //nombreCorto: this.componentForm.value.nameCorto,//no
      //codigoReeup: this.componentForm.value.codigo,//no
      //telefono: this.componentForm.value.contactPhone,//no
      identificador: this.componentForm.value.ci,//ok
      //fechaCreacion: Date.now(),//no
      //pais: 1,//no
      username: this.componentForm.value.username//ok

    } as Cliente;
  }

  getClientFormDataUser(idClient: any): CreateUser {
    var user = new CreateUser()
    
      user.username = this.componentForm.value.username,
      user.email = this.componentForm.value.email,
      user.usuarioId = idClient,
      user.password = this.componentForm.value.password,
      user.listRoles = [3]

      return user
  }

  /**
   * Description: Function para mostrar mensaje de error luego de adicionar un cliente
   * @param {any} error
   * @returns {any}
   *  */

  addClientNotificationError(error: any): void {
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
  addClientNotification(cliente: Cliente): void {
    Swal.fire({
      title: '¡Cliente adicionado!',
      html: `El cliente con nombre <strong>${cliente.name}</strong> ha sido adicionado correctamente`,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      ...commonConfig,
    });
  }

   obtenerListadoClientes(): void {
    this.clienteService
      .getListadoClientes()
      .pipe(debounceTime(50000))
      .subscribe(
        (resp) => {
          this.ClientesList = resp;
        },
        (err: HttpErrorResponse) => {
          handlerResponseError(err);
        }
      );
  }
}
