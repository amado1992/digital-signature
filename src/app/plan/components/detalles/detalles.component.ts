import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  DaysBetween,
  commonConfig,
  days_between,
  diffDays,
  esRangeLabel,
  handlerResponseError,
} from 'src/app/utils/common-configs';
import { CertificateInfo, Plan, planClienteCertificadoAsociacion } from '../../interfaces/plan';
import { PlanService } from '../../services/plan.service';
import Swal from 'sweetalert2';

const clients: any = [{
  id: 2,
  description: "Lorem ipsum dLorem ipsum dolor sit amet Ut voluptatibus repellat",
  lastName: "sasasas",
  name: "aaaaa",
  province: "La Habana",
  address: "Lorem ipsum dLorem ipsum dolor sit amet Ut voluptatibus repellat",
  contactPhone: "78822579",
  contactEmail: "alain@gmail.com",
  institutional: false,
  country: "Cuba",
  certificates: null,
  nombreCorto: null,
  codigoReeup: null,
  telefono: "78822579",
  identificador: "83052127540",
  fechaCreacion: 1682530978140,
  datosBancariosDtoList: [
    {
      id: 1,
      cuentaBancaria: "",
      nombre: "Nombre de cuenta bancaria",
      titular: "",
      observaciones: "",
      monedas: {
        id: 0,
        descripcion: "USD"
      },
      nombreBanco: "",
      sucursal: ""
    }
  ],
  usuario: [],
  payments: null
}]

const plan = [
  {
    id: 152,
    duracion: 24,
    inicio: 1688428800000,
    costo: 1,
    cantidad_certificados: 1,
    activo: true,
    nombre: "PlanNatural",
    descripcion: "Plan Natural",
    asociado: true,
    vencimiento: null,
    vigenciaCompra: null,
    tipoPlan: false,
    cantidadFirmas: 20,
    cantidadValidaciones: 40,
    tipoPlanNatural: true,
    clients: [
      {
        id: null,
        description: null,
        lastname: null,
        name: "Dummy Client",
        province: null,
        address: null,
        contactphone: null,
        contactemail: null,
        institutional: null,
        country: null,
        certificates: [],
        apiClients: [],
        datosBancarioses: [],
        nombreCorto: null,
        codigoReeup: null,
        telefono: null,
        identificador: null,
        fechaCreacion: null,
        daoUsers: []
      }
    ]
  }
]

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.scss'],
  animations: [
    trigger('detailExpand', [
      state(
        'void',
        style({ height: '0px', minHeight: '0', visibility: 'hidden' })
      ),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DetallesComponent implements OnInit, AfterViewInit {
  files?: FileList | null;
  hiddenTableCertificados?: boolean;
  associatePlan?: any;
  fileInfo: string = "";
  hiddenLoading: boolean = false;
  certificatesClient: CertificateInfo[] = []

  //plan!: Plan;
  plan: any;
  vencimiento!: Date;
  diffDays!: number;
  //https://stackoverflow.com/questions/65098671/angular-material-matpaginator-showing-page-0-of-0
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  displayedColumnsPlan: string[] = [
    'nombre',
    'duracion',
    'limiteFirmas',
    'inicio',
    'costo',
    'estado',
    'clienteApi',
    'tipoPlanNatural',
    'pago',
    'moneda',
    'limite',
  ];

  displayedColumns: string[] = [
    'name',
    'mail',
    'inst',
    'user',
    'phone',
    'country',
    'prov',
    'expand'
  ];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any | null;
  dataSourcePlan = new MatTableDataSource<any>();
  dataSource = new MatTableDataSource<any>();
  // dataSource = MatTableDataSource<any>;
  /**
   * Description
   * @param {Router} privaterouter
   * @param {ActivatedRoute} privateactivatedRoute
   * @param {PlanService} readonlyservice
   *  */
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    readonly service: PlanService,
    public _MatPaginatorIntl: MatPaginatorIntl,
    private authService: AuthService
  ) {
    // this.dataSource.data = this.TREE_DATA;
    //this.dataSource.data = this.plan.clients!;
  }

  isExpansionDetailRow = (index: any, row: any) =>
    row.hasOwnProperty('detailRow');

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
    this.isAuthenticatedUser();
    this._MatPaginatorIntl.firstPageLabel = 'Primera página';
    this._MatPaginatorIntl.itemsPerPageLabel = 'Clientes por página:';
    this._MatPaginatorIntl.lastPageLabel = 'Ultima página';
    this._MatPaginatorIntl.nextPageLabel = 'Página siguiente';
    this._MatPaginatorIntl.previousPageLabel = 'Página anterior';
    this._MatPaginatorIntl.getRangeLabel = esRangeLabel;

    //draft
    /*this.plan = plan;
    Object.assign(this.plan, plan[0])
    var today = new Date();
    this.vencimiento = new Date(
      today.setMonth(today.getMonth() + this.plan.duracion)
    );

    this.diffDays = days_between(this.vencimiento, today);
    var cmas = new Date(today.getFullYear(), 11, 25);
    if (today.getMonth() == 11 && today.getDate() > 25) {
      cmas.setFullYear(cmas.getFullYear() + 1);
    }
    var one_day = 1000 * 60 * 60 * 24;
    console.log("www", this.plan)
    this.dataSourcePlan = new MatTableDataSource<any>(this.plan);

    this.dataSource.data = clients //this.plan[0].clients;
    setTimeout(() => (this.dataSource.paginator = this.paginator));*/
    //end draft

    this.getPlan();
  }

  ngAfterViewInit() {
  }

  getPlan() {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.service.buscarPlanPorId(id)))
      .subscribe((plan) => {
        this.plan = plan;
        var today = new Date();
        this.vencimiento = new Date(
          today.setMonth(today.getMonth() + this.plan.duracion)
        );

        this.diffDays = days_between(this.vencimiento, today);
        var cmas = new Date(today.getFullYear(), 11, 25);
        if (today.getMonth() == 11 && today.getDate() > 25) {
          cmas.setFullYear(cmas.getFullYear() + 1);
        }
        var one_day = 1000 * 60 * 60 * 24;

        const data: {
          nombre: string;
          duracion: number;
          inicio: number;
          costo: number;
          estado: boolean;
          pago: string;
          moneda: string;
          limite: number;
          cantidadFirmas: number;
          tipoPlan: boolean;
        }[] = [
            {
              nombre: this.plan.nombre,
              duracion: this.plan.duracion,
              inicio: this.plan.inicio,
              costo: this.plan.costo,
              estado: this.plan.activo,
              pago: this.plan.tipoPagoDto != undefined ? this.plan.tipoPagoDto.descripcion : "",
              moneda: this.plan.monedaDto != undefined ? this.plan.monedaDto.descripcion : "",
              limite: this.plan.cantidad_certificados,
              cantidadFirmas: this.plan.cantidadFirmas,
              tipoPlan: this.plan.tipoPlan,
            },
          ];

        this.dataSourcePlan = new MatTableDataSource<any>(data);

        if (this.plan.clients != undefined) {
          this.dataSource.data = this.plan.clients;
        }
        setTimeout(() => (this.dataSource.paginator = this.paginator));
      });
  }

  /**
   * Description
   * @param {Event} event
   * @returns {any}
   *  */
  applyFilter(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  // private _transformer = (node: any, level: number) => {
  //   return {
  //     expandable: !!node.certificates && node.certificates.length > 0,
  //     name: node.name + ' ' + node.lastName,
  //     level: level,
  //   };
  // };

  // treeControl = new FlatTreeControl<any>(
  //   (node) => node.level,
  //   (node) => node.expandable
  // );

  // treeFlattener = new MatTreeFlattener(
  //   this._transformer,
  //   (node) => node.level,
  //   (node) => node.expandable,
  //   (node) => node.certificates
  // );

  // dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  // dataSource = new MatTableDataSource<any>();

  hasChild = (_: number, node: any) => node.expandable;

  // TREE_DATA: any[] = [
  //   {
  //     name: 'Fruit',
  //     children: [
  //       { name: 'Apple' },
  //       { name: 'Banana' },
  //       { name: 'Fruit loops' },
  //     ],
  //   },
  //   {
  //     name: 'Vegetables',
  //     children: [
  //       {
  //         name: 'Green',
  //       },
  //       {
  //         name: 'Orange',
  //       },
  //     ],
  //   },
  // ];

  /**
   * Description
   * @returns {any}
   *  */
  regresar(): void {
    this.router.navigate(['/dashboard/planes']);
    // this.router.navigate(['/../..']);
  }

  checkDuplicateFile(file: File, nextFile: File): boolean {
    if ((file.name === nextFile.name &&
      file.lastModified === nextFile.lastModified &&
      file.size === nextFile.size &&
      file.type === nextFile.type) ||

      (file.name != nextFile.name &&
        file.lastModified === nextFile.lastModified &&
        file.size === nextFile.size &&
        file.type === nextFile.type)
    ) {
      return true
    }

    return false
  }

  /**
   * Called when the value of the file input changes, i.e. when a file has been
   * selected for upload.
   *
   * @param input the file input HTMLElement
   */
  async onFileSelect(input: HTMLInputElement, clientId: number): Promise<void> {

    this.associatePlan = this.plan

    this.files = input.files!;

    const existingFiles: any[] = []
    var existingFile: boolean = false

    let puedoContinuar: boolean = true;
    //Iteramos por cada uno de los ficheros que ha seleccionado .crt o .cert el usuario para verificar validez de extensión del mismo
    for (let index = 0; index < input.files!.length; index++) {

      if (input.files != null) {
        existingFiles.push(input.files[index])
      }

      const file = input.files![index].name;
      puedoContinuar = this.validate_fileupload(file);

      if (!puedoContinuar) {
        Swal.fire({
          title: '¡Ha ocurrido el siguiente error!',
          html: `Ha seleccionado un fichero (<strong>${file}</strong>) que tiene extensión no permitida, todos los ficheros de certificados tienen que tener extensión de tipo .crt o .cert.`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          ...commonConfig,
        });
        return;
      }
    }

    for (let index = 0; index < existingFiles.length; index++) {
      for (let nextIndex = 0; nextIndex < existingFiles.length; nextIndex++) {

        if (index != nextIndex) {
          if (input.files != null) {
            existingFile = this.checkDuplicateFile(existingFiles[index], existingFiles[nextIndex])
          }

          if (existingFile) {
            Swal.fire({
              title: '¡Ha ocurrido la siguiente alerta!',
              html: 'Existen certificados que se repiten.',
              icon: 'warning',
              confirmButtonText: 'Aceptar',
              ...commonConfig,
            });
            console.warn('Existing file: ', existingFile)
            return
          }
        }
      }
    }

    if (puedoContinuar) {
      if (!this.CompararContraLimiteCertificadosPlan(this.associatePlan.cantidad_certificados)) {
        this.hiddenLoading = true;
        //Solo invocamos al servicio en caso que el número de certificados sea menor igual que el límite de certificados permitidos por el plan.
        this.service.getCertificatesInfo(this.files).subscribe({
          next: (res: CertificateInfo[]) => {
            this.certificatesClient = res;
            this.saveCreateAssociation(this.associatePlan.id, clientId)
          },
          error: (e) => {
            handlerResponseError(e);
            console.error(e)
            this.hiddenLoading = false;
          },
          complete: () => {
            console.info('complete')
          }
        })

      }
      this.files = null;
    }
  }

  validate_fileupload(fileName: string): boolean {
    var allowed_extensions: Array<string>;
    allowed_extensions = ['crt', 'cert'];

    var file_extension = fileName.split('.').pop()!.toLowerCase();

    for (var i = 0; i <= allowed_extensions.length; i++) {
      if (allowed_extensions[i] == file_extension) {
        return true;
      }
    }
    return false;
  }

  /**
 * Description: Compara total de certificados contenidos en fichero de cliente, contra límite de certificados permitidos en el plan.
 * @param {number} limit
 * @param {File} file
 * @returns {boolean}
 *  */
  private CompararContraLimiteCertificadosPlan(limit: number): boolean {
    if (this.files!.length > limit) {
      Swal.fire(
        {
          title: '¡Ha ocurrido el siguiente error!',
          html: `Ha seleccionado un total de ${this.files!.length
            } certificados que excede el límite de certificados permitidos en este plan. Este plan solo admite un total de ${limit} certificados por cliente.`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          ...commonConfig,
        }
      );
      return true;
    } else {
      return false;
    }
  }

  /**
 * Description
 * @param {any} m
 * @returns {any}
 *  */
  sleep = (m: any): any => new Promise((r) => setTimeout(r, m));

  /**
   * Description: Function para hacer persistente la relación plan, cliente y certificados!
   * @returns {any}
   *  */
  saveCreateAssociation(planId: number, clientId: number): void {

    const asociacion: planClienteCertificadoAsociacion = {
      planId: planId,
      clientId: clientId,
      certificadoDtoList: this.certificatesClient,
    };

    this.service.crearAsociacion(asociacion).subscribe({
      next: (res) => {
        this.hiddenLoading = false;
        this.getPlan()
        Swal.fire('Asociación creada con exito!', res.mensaje, 'success');
      },
      error: (e) => {
        handlerResponseError(e);
        console.error(e)
        this.hiddenLoading = false;
      },
      complete: () => {
        console.info('complete')
      }
    });
  }

  importCertificates(): void {
  }

}
