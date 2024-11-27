import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DialogData, DialogTypes } from '../models/dialog';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root',
})
export class HandleErrorsService {
  private error: HttpErrorResponse | null = null;

  constructor(
    private dialogService: DialogService,
    private authService: AuthService,
    private storageMap: StorageMap
  ) {}

  handleErrors(err: HttpErrorResponse): Observable<HttpErrorResponse | any> {
    this.error = err;
    this.exe();
    return throwError(() => err);
  }

  private exe(): void {
    if (this.error?.status === 401) {
      this.authService.logout();
      const msg = this.error.error.message || null;
      if (msg) {
        if (msg === 'UNAUTHORIZED') {
          // this.dialog(
          //   'Usuario desconocido en el sistema, verifique credenciales e intente nuevamente',
          //   'Error iniciando sesión',
          //   'error'
          // );
          // localStorage.setItem('userInvalid', 'Si');
          this.storageMap.set('userInvalid', 'Si').subscribe(() => {});
        }
      }
    }

    if (this.error?.status === 402) {
      this.dialog(this.error.error.message);
    }

    if (this.error?.status === 403) {
      this.dialog(this.error.error.message);
    }
  }

  private dialog(
    body: string | string[],
    header: string = 'Error',
    type: DialogTypes = 'error'
  ): void {
    const data: DialogData = {
      header,
      body,
      type,
    };
    this.dialogService.openDialog(data);
  }
}
