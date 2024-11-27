import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable, tap } from 'rxjs';
import {
  ReqUser,
  ReqUserData,
  ResCreateOrUpdatedUser,
} from 'src/app/auth/models/user';
import { DialogData } from 'src/app/shared/models/dialog';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { environment } from 'src/environments/environment';
import { UpdateUserComponent } from '../components/update-user/update-user.component';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class UpdateUserService {
  private api = environment.api;
  dialogRef: MatDialogRef<UpdateUserComponent, any> | null = null;

  /**
   * Description
   * @param {HttpClient} privatehttp
   * @param {MatDialog} privatedialog
   * @param {DialogService} privatedialogService
   * @param {UserService} privateuserService
   *  */
  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private userService: UserService
  ) {}

  /**
   * Description
   * @param {number} userId
   * @returns {any}
   *  */
  openDialog(userId: number): void {
    const config: MatDialogConfig<number> = {
      data: userId,
      panelClass: 'custom-dialog',
    };

    this.dialogRef = this.dialog.open(UpdateUserComponent, config);
  }

  /**
   * Description
   * @param {number} userId
   * @param {ReqUser} user
   * @returns {any}
   *  */
  callUpdateUser(
    userId: number,
    user: ReqUser
  ): Observable<ResCreateOrUpdatedUser> {
    const userData: ReqUserData = {
      data: user,
    };
    // console.log('DATA_ENVIADA:', userData);
    return this.http.put<ResCreateOrUpdatedUser>(
      `${this.api}usuario/${userId}`,
      userData
    );
  }

  /**
   * Description
   * @param {number} userId
   * @param {ReqUser} user
   * @returns {any}
   *  */
  updateUser(userId: number, user: ReqUser): void {
    const config: DialogData = {
      header: 'Alerta!',
      body: `¿Está seguro que desea modificar el usuario ${user.usuario}?`,
      type: 'dialog',
    };
    this.dialogService.openDialog(config).subscribe((res) => {
      if (res) {
        this.callUpdateUser(userId, user)
          .pipe(tap((res) => this.handleUpdateUser(res)))
          .subscribe();
      }
    });
  }

  /**
   * Description
   * @param {ResCreateOrUpdatedUser} res
   * @returns {any}
   *  */
  handleUpdateUser(res: ResCreateOrUpdatedUser): void {
    if (!res.ok) return;
    this.userService.getUsersCall();
    this.dialogRef?.close();
  }
}
