import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Cliente } from 'src/app/clientes/interfaces/clientes.interface';
import {
  CertificateInfo,
  clienteCertificadosAsociacion,
  Plan,
  planClienteAsociacion,
  planClienteCertificadoAsociacion,
} from 'src/app/plan/interfaces/plan';

import {
  commonConfig,
  esRangeLabel,
  handlerResponseError,
  removeItem,
} from 'src/app/utils/common-configs';
import Swal from 'sweetalert2';
import { MisPlanesService } from '../../service/mis-planes.service';

@Component({
  selector: 'app-mis-planes',
  templateUrl: './mis-planes.component.html',
  styleUrls: ['./mis-planes.component.scss'],
})
export class MisPlanesComponent implements OnInit {
  //array para filtrar solamente los clientes naturales o jurídicos dependiendo del tipo de plan seleccionado
  // filterData: Cliente[] = [];
  // viewDropdown: boolean = false;

  // //Referencia al modal del create/update item
  // modalRef?: BsModalRef;

  // certificadosCliente!: CertificateInfo[];
  // files!: FileList | null;
  // hiddenTableCertificados!: boolean;
  // selectedItemCliente: any = [];
  // dropdownListClientes: any = [];
  // dropdownSettingsClientes: IDropdownSettings = {};

  // //Para especificar simple selección o selección múltiple de fichero, dependiendo del plan seleccionado.
  // multipleFiles: boolean = false;
  // //Plan seleccionado a asociar con cliente y certificados, útil para discriminar si es un plan Natural o Jurídico y de este modo
  // //establecer al control fileUpload si es de selección simple o múltiple.
  // planAsociar!: Plan;

  // fileInfo!: string;
  // hiddenLoading!: boolean;
  // formAsociarValid!: boolean;

  // formAsociar!: FormGroup;
  // p: number = 1;
  // pModalPermisos: number = 1;
  // searchText = '';

  // inicio: any;
  // isChecked!: boolean;
  // isCheckedTipoPlan!: boolean;
  // isCheckedTipoPlanNatural!: boolean;
  // disableImp: boolean = true;

  // displayedColumnsPlan: string[] = [
  //   'nombre',
  //   'duracion',
  //   'inicio',
  //   'costo',
  //   'estado',
  //   'clienteApi',
  //   'tipoPlanNatural',
  //   'pago',
  //   'moneda',
  //   'limite',
  // ];
  // displayedColumns: string[] = ['name', 'id'];
  // @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  // dataSourcePlan = new MatTableDataSource<any>();
  // dataSourceCertificados = new MatTableDataSource<any>();

  // titleAsociacionModal: string = '';
  // idPlanModal: number = 0;
  // nombreModal: string = '';
  // duracionModal!: number;
  // inicioModal!: any;
  // costoModal!: number;
  // estadoModal!: boolean;
  // tipoPagoModal!: string;
  // monedaModal: string = '';
  // limiteCertificadosModal!: number;
  // descripcionModal: string = '';

  /**
   * Description
   * @param {BsModalService} privatemodalService
   * @param {FormBuilder} privatefb
   * @param {PlanService} readonlyservice
   * @param {DatePipe} privatedatePipe
   * @param {HttpClient} privatehttp
   * @param {MatPaginatorIntl} public_MatPaginatorIntl
   * @param {Router} privaterouter
   * @param {AuthService} privateauthService
   *  */
  constructor() // // private fb: FormBuilder, // // private modalService: BsModalService,
  // // readonly service: MisPlanesService,
  // // private datePipe: DatePipe,
  // // private http: HttpClient,
  // // public _MatPaginatorIntl: MatPaginatorIntl,
  // // private router: Router,
  // // private authService: AuthService
  {}

  /**
   * Description
   * @returns {any}
   *  */
  ngOnInit(): void {
    // this.isAuthenticatedUser();
    // this.isChecked = true;
    // this._MatPaginatorIntl.firstPageLabel = 'Primera página';
    // this._MatPaginatorIntl.itemsPerPageLabel = 'Clientes por página:';
    // this._MatPaginatorIntl.lastPageLabel = 'Ultima página';
    // this._MatPaginatorIntl.nextPageLabel = 'Página siguiente';
    // this._MatPaginatorIntl.previousPageLabel = 'Página anterior';
    // this._MatPaginatorIntl.getRangeLabel = esRangeLabel;
    // // this.service.fetchList(1);
    // this.hiddenLoading = true;
    // this.hiddenTableCertificados = true;
    // this.formAsociarValid = true;
  }

  // private newMethod(
  //   tipoPlanNatural: boolean,
  //   filterData: Cliente[],
  //   data: Cliente[]
  // ) {
  //   if (tipoPlanNatural) {
  //     filterData = [];
  //     for (const employee of data) {
  //       if (!employee.institutional) {
  //         const details: any = {
  //           id: employee.id,
  //           name: employee.name,
  //         };
  //         //Verificamos si el objeto existe previamente en el array filterData
  //         const found = filterData.find((obj) => obj.name === details.name);
  //         //Si no existe, lo adicionamos entonces
  //         if (!found) filterData.push(details);
  //       }
  //     }
  //   } else {
  //     filterData = [];
  //     for (const employee of data) {
  //       if (employee.institutional) {
  //         const details: any = {
  //           id: employee.id,
  //           name: employee.name,
  //         };
  //         //Verificamos si el objeto existe previamente en el array filterData
  //         const found = filterData.find((obj) => obj.name === details.name);
  //         //Si no existe, lo adicionamos entonces
  //         if (!found) filterData.push(details);
  //       }
  //     }
  //   }
  //   !filterData.length
  //     ? (this.viewDropdown = false)
  //     : (this.viewDropdown = true);
  //   this.dropdownListClientes = filterData;
  //   return filterData;
  // }

  /**
   * Description Inicializamos los valores del multiselect control para listar los clientes
   * @returns {any}
   *  */
  // dropdownInitClientes(tipoPlanNatural: boolean): void {
  //   this.dropdownSettingsClientes = {
  //     singleSelection: true,
  //     idField: 'id',
  //     textField: 'name',
  //     allowSearchFilter: true,
  //     searchPlaceholderText: 'Buscar',
  //     noDataAvailablePlaceholderText: 'No se ha encontrado ningún resultado',
  //     noFilteredDataAvailablePlaceholderText:
  //       'No se ha encontrado ningún resultado',
  //   };
  //   let response: Cliente[] = [];
  //   this.service.itemsClientes$.subscribe(
  //     (data: Cliente[]) => {
  //       if (data) {
  //         // Asignamos todos los clientes que no han sido asociados aún al plan seleccionad, dependiendo del tipo de cliente y el tipo de plan seleccionado
  //         response = data;
  //         this.newMethod(tipoPlanNatural, this.filterData, response);
  //       }
  //     },
  //     (err: HttpErrorResponse) => {
  //       handlerResponseError(err);
  //     }
  //   );
  // }

  /**
   * Description: Verifica si el usuario se encuentra logueado, en caso contrario se redirecciona hacia el login
   * @returns {any}
   *  */
  // private isAuthenticatedUser() {
  //   this.authService.getIsLogged().pipe(
  //     tap((res) => {
  //       if (!res) {
  //         this.router.navigate(['/login']);
  //         return;
  //       }
  //     })
  //   );
  // }

  /**
   * Description
   * @param {any} m
   * @returns {any}
   *  */
  sleep = (m: any): any => new Promise((r) => setTimeout(r, m));

  /**
   * Description
   * @returns {any}
   *  */
  // private setCertificadosDataSource() {
  //   this.dataSourceCertificados.data = this.certificadosCliente;
  //   this.dataSourceCertificados.paginator = this.paginator;
  // }

  /**
   * Called when the value of the file input changes, i.e. when a file has been
   * selected for upload.
   *
   * @param input the file input HTMLElement
   */
  // async onFileSelect(input: HTMLInputElement, limit: number): Promise<void> {
  //   /**
  //    * Format the size to a human readable string
  //    *
  //    * @param bytes
  //    * @returns the formatted string e.g. `105 kB` or 25.6 MB
  //    */
  //   function formatBytes(bytes: number): string {
  //     const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  //     const factor = 1024;
  //     let index = 0;

  //     while (bytes >= factor) {
  //       bytes /= factor;
  //       index++;
  //     }

  //     return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
  //   }

  //   //Ocultamos la tabla de certificados que puede estar visible, por un proceso previo de análisis.
  //   this.hiddenTableCertificados = true;
  //   this.fileInfo = '';
  //   if (this.planAsociar.tipoPlanNatural) {
  //     //TODO: Implementar lógica correspondiente para procesar un array de ficheros de certificados
  //     let file = input.files![0].name;
  //     // console.log(file);
  //   } else {
  //     //TODO: Implementar lógica correspondiente para procesar un solo fichero de certificado
  //     for (let index = 0; index < input.files!.length; index++) {
  //       const file = input.files![index].name;
  //       // console.log(file);
  //     }
  //   }

  //   let file = input.files![0];
  //   this.files = input.files!;
  //   if (
  //     !this.CompararContraLimiteCertificadosPlan(
  //       this.planAsociar.cantidad_certificados,
  //       null
  //     )
  //   ) {
  //     this.hiddenLoading = false;
  //     //Solo invocamos al servicio en caso que el número de certificados sea menor igual que el límite de certificados permitidos por el plan.
  //     this.service.getCertificatesInfo(this.files).subscribe(
  //       (res: CertificateInfo[]) => {
  //         // this.certificadosCliente = res;
  //         // this.hiddenLoading = true;

  //         // async () => {
  //         this.sleep(5000000);
  //         this.hiddenLoading = true;
  //         this.certificadosCliente = res;
  //         this.setCertificadosDataSource();
  //         this.hiddenTableCertificados = false;
  //         // };
  //       },
  //       (err: HttpErrorResponse) => {
  //         handlerResponseError(err);
  //       }
  //     );
  //   }
  //   this.files = null;
  // }

  /**
   * Description: Compara total de certificados contenidos en fichero de cliente, contra límite de certificados permitidos en el plan.
   * @param {number} limit
   * @param {File} file
   * @returns {boolean}
   *  */
  // private CompararContraLimiteCertificadosPlan(
  //   limit: number,
  //   file: File | null
  // ): boolean {
  //   if (this.files!.length > limit) {
  //     this.formAsociarValid = true;
  //     Swal.fire(
  //       // `Ha ocurrido el siguiente error`,
  //       // `El fichero ${file.name} tiene un total de ${this.certificadosCliente.length} certificados que excede el límite de certificados permitidos en este plan. Este plan solo admite un total de ${limit} certificados por cliente.`,
  //       // 'error'
  //       {
  //         title: '¡Ha ocurrido el siguiente error!',
  //         html: `Ha seleccionado un total de ${
  //           this.files!.length
  //         } certificados que excede el límite de certificados permitidos en este plan. Este plan solo admite un total de ${limit} certificados por cliente.`,
  //         icon: 'error',
  //         confirmButtonText: 'Aceptar',
  //         ...commonConfig,
  //       }
  //     );
  //     //return true to stop processing txt file
  //     return true;
  //   } else {
  //     this.formAsociarValid = false;
  //     return false;
  //   }
  // }

  /**
   * Description Obtener ids de permisos seleccionados, se utiliza en las acciones create/update
   * @returns {any}
   *  */
  // getClientesIdSelected(): number {
  //   var id!: number;

  //   if (this.selectedItemCliente.lenght === 0) {
  //     return id;
  //   }

  //   for (let item of this.selectedItemCliente) {
  //     id = item.id;
  //   }

  //   return id;
  // }

  /**
   * Description: Function para hacer persistente la relación plan, cliente y certificados!
   * @returns {any}
   *  */
  // SaveChagesAsociar(_planId: number): void {
  //   // console.log(_planId);
  //   const planCliente: planClienteAsociacion = {
  //     clienteId: this.getClientesIdSelected(),
  //     planId: _planId,
  //   } as planClienteAsociacion;

  //   const clienteCertificados: clienteCertificadosAsociacion = {
  //     idClient: this.getClientesIdSelected(),
  //     certificadoDtoList: this.certificadosCliente,
  //   };

  //   const asociacion: planClienteCertificadoAsociacion = {
  //     planId: _planId,
  //     clientId: this.getClientesIdSelected(),
  //     certificadoDtoList: this.certificadosCliente,
  //   };

  //   this.service.crearAsociacion(asociacion).subscribe(
  //     (res) => {
  //       // console.log(res);
  //       Swal.fire('Asociación creada con exito!', res.mensaje, 'success');
  //     },
  //     (err: HttpErrorResponse) => {
  //       handlerResponseError(err);
  //     }
  //   );
  //   this.modalRef?.hide();
  // }

  /**
   * Description
   * @param {TemplateRef<any>} template
   * @param {Rol} rol?
   * @returns {any}
   *  */
  // openModalAsociacion(template: TemplateRef<any>, plan: Plan): any {
  //   this.planAsociar = plan;
  //   //Obtenemos los clientes que aún no han sido asociado al plan que se recibe como params
  //   this.service.fetchListClientes(plan.id!);
  //   this.dropdownInitClientes(plan.tipoPlanNatural);

  //   //Especificamos el nombre del modal
  //   this.titleAsociacionModal = `Asociar plan, cliente y certificados`;
  //   this.idPlanModal = plan.id!;
  //   this.nombreModal = plan!.nombre;
  //   this.duracionModal = plan!.duracion;
  //   this.inicioModal = this.datePipe.transform(plan!.inicio, 'yyyy-dd-MM');
  //   this.costoModal = plan!.costo;
  //   this.estadoModal = plan!.activo;
  //   this.tipoPagoModal = plan!.tipoPagoDto.descripcion;
  //   this.monedaModal = plan!.monedaDto.descripcion;
  //   this.limiteCertificadosModal = plan?.cantidad_certificados!;
  //   this.descripcionModal = plan!.descripcion;

  //   const data: {
  //     nombre: string;
  //     duracion: number;
  //     inicio: number;
  //     costo: number;
  //     estado: boolean;
  //     pago: string;
  //     moneda: string;
  //     limite: number;
  //   }[] = [
  //     {
  //       nombre: plan.nombre,
  //       duracion: plan.duracion,
  //       inicio: plan.inicio,
  //       costo: plan.costo,
  //       estado: plan.activo,
  //       pago: plan.tipoPagoDto.descripcion,
  //       moneda: plan.monedaDto.descripcion,
  //       limite: plan.cantidad_certificados,
  //     },
  //   ];

  //   this.dataSourcePlan = new MatTableDataSource<any>(data);

  //   //Seteamos el listado de permisos asignados del rol, al listado definido como variable bindeada con el component.html.
  //   // this.listadoPermisosAsignadosModal = rol?.operationTypes!;
  //   //asignamos el rol seleccionado con el rol bindeado con el component.html
  //   // this.selectedRol = rol!;
  //   // console.log(this.form.value.name);
  //   //https://stackoverflow.com/questions/48881432/ngx-bootstrap-when-modal-height-is-dynamic-scroll-is-not-coming
  //   this.modalRef = this.modalService.show(template, {
  //     ignoreBackdropClick: true,
  //     keyboard: false,
  //     // class: 'modal-dialog-centered modal-dialog-scrollable',
  //     // class: 'modal-dialog-scrollable',
  //   });
  //   this.modalRef.onHide!.subscribe((reason: string | any) => {
  //     //reiniciamos en 0 la selección del control que lista los clientes
  //     this.selectedItemCliente = [];
  //     //seteamos en true la propiedad que inhabilita el botón de seleccionar certificados
  //     this.disableImp = true;
  //     //seteamos en blank el div que muestra la info del fichero seleccionado
  //     this.fileInfo = '';
  //     //seteamos en true la property que invalida este formulario de asociacion
  //     this.formAsociarValid = true;
  //     //seteamos en true la property que oculta el grid de certificados
  //     this.hiddenTableCertificados = true;
  //   });
  // }

  /**
   * Description
   * @param {Event} event
   * @returns {any}
   *  */
  // applyFilter(event: Event) {
  //   let filterValue = (event.target as HTMLInputElement).value;
  //   // console.log(filterValue);
  //   filterValue = filterValue.trim(); // Remove whitespace
  //   filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  //   this.dataSourceCertificados.filter = filterValue;
  //   // const filterValue = (event.target as HTMLInputElement).value;
  //   // this.dataSourceCertificados.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSourceCertificados.paginator) {
  //     this.dataSourceCertificados.paginator.firstPage();
  //   }
  // }

  /**
   * Description
   * @returns {any}
   *  */
  // impCertificados(): void {
  //   // this.file.nativeElement.click();
  //   this.hiddenLoading = true;
  //   // this.hiddenTableCertificados = true;
  // }

  /**
   * Description
   * @param {any} item
   * @returns {any}
   *  */
  // onItemSelectCliente(item: any): any {
  //   //Habilitamos el btn de importar certificado, siempre que se seleccione al menos un cliente
  //   this.disableImp = false;
  //   //Habilitamos el btn de salvar asociación, siempre y cuando se esté mostrando la tabla de listado de certificados, previamente cargada
  //   if (!this.hiddenTableCertificados) this.formAsociarValid = false;
  //   this.selectedItemCliente = [];
  //   this.selectedItemCliente.push(item);
  //   // console.log(this.selectedItemCliente);
  // }

  /**
   * Description
   * @param {any} item
   * @returns {any}
   *  */
  // onItemDeSelectCliente(item: any): any {
  //   //DesHabilitamos el btn de importar certificado, hasta que se seleccione al menos un cliente
  //   this.disableImp = true;
  //   //DesHabilitamos el btn de salvar asociación, hasta que se seleccione al menos un cliente
  //   this.formAsociarValid = true;
  //   removeItem(this.selectedItemCliente, item);
  //   this.selectedItemCliente = [];
  //   // console.log(this.selectedItemCliente);
  // }
}
