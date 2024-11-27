import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { ReqUser, ResCreateOrUpdatedUser, User } from 'src/app/auth/models/user';
import { UpdateUserService } from 'src/app/user/services/update-user.service';
import { PasswordComponent } from '../components/password/password.component';
import { DialogData } from '../models/dialog';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  private dialogRef: MatDialogRef<PasswordComponent> | null = null;

  constructor(
    private updateUserService: UpdateUserService,
    private dialog: MatDialog,
    private dialogService: DialogService
    ) { }

  openDialog(): void {

    const config: MatDialogConfig = {
      panelClass: 'custom-dialog',
      autoFocus: false
    }

    this.dialogRef = this.dialog.open(PasswordComponent, config);
  }

  updateUserPassword(password: string): void {

    const config: DialogData = {
      header: 'Alerta!',
      body: `¿Está seguro que desea modificar su contraseña?`,
      type: 'dialog'
    }
    this.dialogService.openDialog(config)
    .subscribe(resDialog => {
      if(!resDialog) return;

      let user: User;

    try {
      const userLs = localStorage.getItem('user');
      if(!userLs) return;
      user = JSON.parse(userLs);
    } catch (error) {
      throw error;
    }

    const { rol, idusuario, ...rest } = user;

    const data: ReqUser = {
      ...rest,
      password,
      roles: []
    }

    if(rol.includes('User')) {
      data.roles?.push(1)
    }

    if(rol.includes('Admin')) {
      data.roles?.push(2)
    }

    this.updateUserService.callUpdateUser(<number>idusuario, data).pipe(
      tap(res => this.handleUpdate( res ))
    ).subscribe();

    });

  }

  private handleUpdate(res: ResCreateOrUpdatedUser): void {
    // console.log(res);
    if(res.ok) {
      this.dialogRef?.close();

      const config: DialogData = {
        header: 'Información',
        body: 'Su contraseña se ha actualizado correctamente.',
        type: 'success'
      }
      this.dialogService.openDialog(config);

    }

  }

}
