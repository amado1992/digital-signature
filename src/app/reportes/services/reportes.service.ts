import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { handlerResponseError } from 'src/app/utils/common-configs';
import { environment } from 'src/environments/environment';

import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  private baseUrl: string = environment.api;
  fileUrl: any;
  constructor(private http: HttpClient) {}

  headers = new HttpHeaders().set(
    'Content-Type',
    'application/pdf; charset=utf-8'
  );

  //https://stackoverflow.com/questions/53627244/angular7-unable-to-set-responsetype-text
  requestOptions: Object = {
    /* other options here */
    responseType: 'arraybuffer',
  };

  getCertificatesByClient(idCliente: any): Observable<BlobPart> {
    // return this.http.post<any>(
    //   `${this.baseUrl}reportClienteCertificados/${idCliente}`,
    //   idCliente
    // );
    return this.http.get<any>(
      `${this.baseUrl}reportClienteCertificados/${idCliente}`,
      this.requestOptions
    );
    //   .subscribe(
    //     (data) => {
    //       let file = new Blob([data], {
    //         type: 'application/pdf',
    //       });
    //       this.fileUrl = URL.createObjectURL(file);
    //       // window.open(this.fileUrl);
    //     },
    //     (err: HttpErrorResponse) => {
    //       // handlerResponseError(err);
    //       console.log(err);
    //     }
    //   );
    // return this.fileUrl;
  }
}
