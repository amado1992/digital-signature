import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Cliente } from 'src/app/clientes/interfaces/clientes.interface';
import { UsersService } from 'src/app/users/services/users.service';
import { handlerResponseError, removeItem } from 'src/app/utils/common-configs';
import { ReportesService } from '../../services/reportes.service';

import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent implements OnInit {
  imageBlobUrl: string | ArrayBuffer | null = null;

  // reportes: { item_id: number; item_text: string }[] = [];
  pdfSrc!: string;
  hiddenLoading!: boolean;
  hiddenReport!: boolean;
  hiddenFilterDiv!: boolean;
  hiddenInfo!: boolean;
  disabledClienteDropdown!: boolean;

  dropdownListTipoReportes: { item_id: number; item_text: string }[] = [];
  dropdownSettingsTipoReportes: IDropdownSettings = {};
  selectedItemTipoReportes: any = [];

  dropdownListClientes: Cliente[] = [];
  dropdownSettingsClientes: IDropdownSettings = {};
  selectedItemCliente: any[] = [];
  clientReportName!: string;
  clientReportId!: number;
  myForm!: FormGroup;

  /**
   * Description
   * @param {UsersService} privateusersService
   * @param {FormBuilder} privatefb
   * @param {ReportesService} privateservice
   *  */
  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    private service: ReportesService
  ) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
  }

  /**
   * Description: OnInit event
   * @returns {any}
   *  */
  ngOnInit(): void {
    if (localStorage.getItem('username') != 'admin') {
      this.selectedItemCliente = [
        {
          id: localStorage.getItem('clientId'),
          name: localStorage.getItem('clientName'),
        },
      ];
      this.clientReportName = this.selectedItemCliente[0].name;
      this.clientReportId = this.selectedItemCliente[0].id;
      // this.clientReportId = +localStorage.getItem('clientId')!;
      this.disabledClienteDropdown = true;
    }
    this.hiddenLoading = true;
    this.hiddenReport = true;
    this.hiddenFilterDiv = true;
    this.hiddenInfo = true;
    this.myForm = this.fb.group({
      reporte: [this.selectedItemTipoReportes],
      cliente: [this.selectedItemCliente],
    });
    this.dropdownInitClientes();
    this.dropdownListTipoReportes = [
      {
        item_id: 1,
        item_text: 'Certificados por Cliente',
        // image: 'http://www.sciencekids.co.nz/images/pictures/flags96/India.jpg',
      },
    ];
    this.dropdownSettingsTipoReportes = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      searchPlaceholderText: 'Buscar',
    };
  }

  /**
   * Description: onItemSelectCliente event
   * @param {any} item
   * @returns {any}
   *  */
  onItemSelectCliente(item: any) {
    this.hiddenReport = true;
    this.hiddenInfo = true;
    this.hiddenLoading = false; //Mostramo el div de loading
    this.selectedItemCliente = [];
    this.selectedItemCliente.push(item);
    this.clientReportName = item.name;
    // console.log(item.id);
    this.certificadosByClient(item.id);
    // this.service.getCertificatesByClient(item.id).subscribe(
    //   (x: any) => {
    //     console.log('x', x);
    //     // It is necessary to create a new blob object with mime-type explicitly set
    //     // otherwise only Chrome works like it should
    //     var newBlob = new Blob([x], { type: 'application/pdf' });

    //     // IE doesn't allow using a blob object directly as link href
    //     // instead it is necessary to use msSaveOrOpenBlob
    //     // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    //     //   window.navigator.msSaveOrOpenBlob(newBlob);
    //     //   return;
    //     // }
    //     console.log(newBlob);

    //     // For other browsers:
    //     // Create a link pointing to the ObjectURL containing the blob.
    //     const data = window.URL.createObjectURL(newBlob);
    //     console.log(data);
    //     var link = document.createElement('a');
    //     link.href = data;
    //     link.download = 'Je kar.pdf';
    //     // this is necessary as link.click() does not work on the latest firefox
    //     link.dispatchEvent(
    //       new MouseEvent('click', {
    //         bubbles: true,
    //         cancelable: true,
    //         view: window,
    //       })
    //     );

    //     setTimeout(function () {
    //       // For Firefox it is necessary to delay revoking the ObjectURL
    //       window.URL.revokeObjectURL(data);
    //       link.remove();
    //     }, 100);
    //   },
    //   (err: HttpErrorResponse) => {
    //     handlerResponseError(err);
    //   }
    // );
  }

  /**
   * Description
   * @param {any} item
   * @returns {any}
   *  */
  private certificadosByClient(clientId: number) {
    this.service.getCertificatesByClient(clientId).subscribe(
      (data) => {
        this.pdfSrc = '';
        if ((data as ArrayBuffer).byteLength > 980) {
          console.log((data as ArrayBuffer).byteLength);
          let file = new Blob([data], {
            type: 'application/pdf',
          });
          this.pdfSrc = URL.createObjectURL(file);

          // if you want to open PDF in new tab
          // window.open(this.pdfSrc);
          // var a = document.createElement('a');
          // a.href = this.pdfSrc;
          // a.target = '_blank';
          // a.download = 'bill.pdf';
          // document.body.appendChild(a);
          // a.click();

          // this.createImageFromBlob(this.pdfSrc);

          console.log(this.pdfSrc);
          this.hiddenReport = false;
          this.hiddenInfo = true;
          // window.open(this.fileUrl);
        } else {
          this.hiddenInfo = false;
        }
        this.hiddenLoading = true;
      },
      (err: HttpErrorResponse) => {
        // handlerResponseError(err);
        console.log(err);
      }
    );
  }

  /**
   * Description
   * @returns {any}
   *  */
  createPdfFileFromBlob(): void {
    // 👇️ const now: Date
    const now = new Date();
    var a = document.createElement('a');
    a.href = this.pdfSrc;
    a.target = '_blank';
    a.download = `CertificadosPorCliente-${
      this.clientReportName
    }${now.toLocaleString()}.pdf`;
    document.body.appendChild(a);
    this.hiddenLoading = false;
    setTimeout(() => {
      a.click();
      this.hiddenLoading = true;
    }, 2000);
  }

  /**
   * Description:createImageFromBlob function
   * https://stackoverflow.com/questions/57497402/how-to-download-a-pdf-file-in-angular-which-is-generated-on-my-serverspringboot
   * @param {Blob} image
   * @returns {any}
   *  */
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.imageBlobUrl = reader.result;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  /**
   * Description: onItemDeSelectCliente event
   * @param {any} item
   * @returns {any}
   *  */
  onItemDeSelectCliente(item: any) {
    removeItem(this.selectedItemCliente, item);
    this.selectedItemCliente = [];
  }

  /**
   * Description: onItemSelectTipoReportes event
   * @param {any} item
   * @returns {any}
   *  */
  onItemSelectTipoReportes(item: any) {
    this.hiddenFilterDiv = false;
    this.selectedItemTipoReportes = [];
    this.selectedItemTipoReportes.push(item);
    console.log(localStorage.getItem('clientId'));
    //Si el usuario logueado no es admin, inmediatamente invocamos el método para obtener reporte de Certificados por Cliente
    if (localStorage.getItem('username') != 'admin') {
      this.hiddenLoading = false; //Mostramos el div de loading
      this.certificadosByClient(this.clientReportId);
    }
  }

  /**
   * Description: onItemDeSelectTipoReportes event
   * @param {any} item
   * @returns {any}
   *  */
  onItemDeSelectTipoReportes(item: any) {
    removeItem(this.selectedItemTipoReportes, item);
    this.selectedItemTipoReportes = [];
    if (localStorage.getItem('username') == 'admin')
      this.selectedItemCliente = [];
    this.hiddenFilterDiv = true;
    this.hiddenInfo = true;
    this.hiddenReport = true;
  }

  /**
   * Description Inicializamos los valores del multiselect control para listar los clientes
   * @returns {any}
   *  */
  dropdownInitClientes(): void {
    this.usersService.fetchListClientes();
    this.usersService.itemsClientes$.subscribe(
      (data) => {
        if (data) {
          console.log(data);
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
    this.dropdownSettingsClientes = {
      closeDropDownOnSelection: true,
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      allowSearchFilter: true,
      searchPlaceholderText: 'Buscar',
      noDataAvailablePlaceholderText: 'No se ha encontrado ningún resultado',
      noFilteredDataAvailablePlaceholderText:
        'No se ha encontrado ningún resultado',
    };
  }
}
