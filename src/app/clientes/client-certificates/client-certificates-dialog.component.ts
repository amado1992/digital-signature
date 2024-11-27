import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CertificateInfo, Plan, clienteCertificadosAsociacion, planClienteAsociacion, planClienteCertificadoAsociacion } from 'src/app/plan/interfaces/plan';
import { PlanService } from 'src/app/plan/services/plan.service';
import { dateValidator } from 'src/app/utils/date-range.validators';
import { MatSort, Sort } from '@angular/material/sort';
import { ClientCertificateDto } from 'src/app/shared/dto/ClientCertificateDto';
import { ClientesService } from '../services/clientes.service';

@Component({
  selector: 'app-client-certificates-dialog',
  templateUrl: './client-certificates-dialog.component.html',
  styleUrls: ['./client-certificates-dialog.component.scss'],
})
export class ClientCertificatesDialogComponent implements OnInit, AfterViewInit {
  client?: Cliente
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>()
  displayedColumns = ['certificate_id', 'enabled', 'descriptive_name'];
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  filter: string = "";
  searchIcon: string = "";
  clearIconColor: string = "";
  isLoadingResults: boolean = false;
  order?: Sort;
  files?: FileList | null;

  displayedColumnsAssignCertificate: string[] = ['name', 'id'];
  @ViewChild('paginatorAssignCertificate') paginatorAssignCertificate?: MatPaginator;
  dataSourceCertificados = new MatTableDataSource<any>();

  hiddenLoading: boolean = false;
  hideForm: boolean = false;
  associateForm = this.fb.group({});
  clientCertificatesInformation: CertificateInfo[] = [];

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    readonly service: PlanService,
    readonly serviceClient: ClientesService,
    private datePipe: DatePipe,
    private http: HttpClient,
    public _MatPaginatorIntl: MatPaginatorIntl,
    private router: Router,
    private authService: AuthService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    if (data.entity != null) {
      this.associationDataManagement(data.entity);
    }

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

  ngOnInit(): void {
    this.order = { active: "", direction: "" };
    this.filter = "";
    this.searchIcon = "search";
    this.clearIconColor = "";
    this.clientCertificates()

    this.isAuthenticatedUser()
    this._MatPaginatorIntl.firstPageLabel = 'Primera página';
    this._MatPaginatorIntl.itemsPerPageLabel = 'Elementos por página:';
    this._MatPaginatorIntl.lastPageLabel = 'Ultima página';
    this._MatPaginatorIntl.nextPageLabel = 'Página siguiente';
    this._MatPaginatorIntl.previousPageLabel = 'Página anterior';
    this._MatPaginatorIntl.getRangeLabel = esRangeLabel;
  }

  clientCertificates() {
    if (this.client != null && this.client.id != null) {
      this.isLoadingResults = true
      this.service.getOnlyCertificatesClient(this.client.id)
        .subscribe({
          next: (response) => {
            this.isLoadingResults = false
            this.dataSource.data = response
          },
          error: (e) => {
            this.isLoadingResults = false
            console.error(e)
            handlerResponseError(e)
          },
          complete: () => console.info('complete')
        })
    }

  }

  /**
   * Called when the value of the file input changes, i.e. when a file has been
   * selected for upload.
   *
   * @param input the file input HTMLElement
   */
  async onFileSelect(input: HTMLInputElement): Promise<void> {
    this.files = input.files;
    if (this.files != null && this.files != undefined) {
      //if (!this.compareAgainstLimitCertifiedPlan(this.associatePlan.cantidad_certificados)) {
      const existingFiles: any[] = []
      var existingFile: boolean = false
      let puedoContinuar: boolean = true;

      //Iteramos por cada uno de los ficheros que ha seleccionado .crt el usuario para verificar validez de extensión del mismo
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
                title: '¡Ha ocurrido el siguiente error!',
                html: 'Existen certificados que se repiten.',
                icon: 'error',
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
        this.hiddenLoading = true;
        //Solo invocamos al servicio en caso que el número de certificados sea menor igual que el límite de certificados permitidos por el plan.
        this.service.getCertificatesInfo(this.files).subscribe({
          next: (res: CertificateInfo[]) => {
            this.hiddenLoading = false;
            this.clientCertificatesInformation = res;
            this.setCertificadosDataSource();
          },
          error: (e) => {
            handlerResponseError(e);
            console.error(e)
          },
          complete: () => {
            console.info('complete')
          }
        })
      }
      //}
    }
  }

  /**
   * Description
   * @returns {any}
   *  */
  private setCertificadosDataSource() {
    this.dataSourceCertificados.data = this.clientCertificatesInformation;
    if (this.paginatorAssignCertificate != undefined) {
      this.dataSourceCertificados.paginator = this.paginatorAssignCertificate;
    }
  }

  /**
   * Description: Compara total de certificados contenidos en fichero de cliente, contra límite de certificados permitidos en el plan.
   * @param {number} limit
   * @param {File} file
   * @returns {boolean}
   *  */
  private compareAgainstLimitCertifiedPlan(limit: number): boolean {
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
   * Description: Valida que la extensión de cada fichero cargado sea permitida por el sistema
   * @param {string} fileName
   * @returns {any}
   *  */
  validate_fileupload(fileName: string): boolean {
    var allowed_extensions: Array<string>;
    allowed_extensions = ['crt', 'cert'];

    var file_extension = fileName.split('.').pop()!.toLowerCase(); // split function will split the filename by dot(.), and pop function will pop the last element from the array which will give you the extension as well. If there will be no extension then it will return the filename.

    for (var i = 0; i <= allowed_extensions.length; i++) {
      if (allowed_extensions[i] == file_extension) {
        return true;
      }
    }
    return false;
  }

  /**
   * Description: Function para hacer persistente la relación plan, cliente y certificados!
   * @returns {any}
   *  */
  saveAssignClientToCertificate(): void {
    var clientCertificateDto = new ClientCertificateDto()
    if (this.clientCertificatesInformation.length == 0) {
      Swal.fire('Ha ocurrido un error', `El asignar certicados al cliente ${this.client?.name} es obligatorio.`, 'error');
    }

    if (this.client != undefined && this.clientCertificatesInformation.length > 0) {
      this.hideForm = true
      clientCertificateDto.idClient = this.client.id
      clientCertificateDto.certificadoDtoList = this.clientCertificatesInformation

      this.serviceClient.assignClientToCertificate(clientCertificateDto).subscribe({
        next: (response: any) => {
          this.hideForm = false
          this.clientCertificatesInformation = []
          this.clientCertificates()
          Swal.fire(`La asignación del certificado al cliente ${this.client?.name} se realizó satisfactoriamente.`, response.mensaje, 'success');
        },
        error: (e) => {
          this.hideForm = false
          handlerResponseError(e);
          console.error(e)
        },
        complete: () => {
          console.info('complete')
        }
      })
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  associationDataManagement(client: Cliente): any {
    this.client = client
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
