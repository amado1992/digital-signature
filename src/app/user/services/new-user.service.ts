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
import { environment } from 'src/environments/environment';
import { NewUserComponent } from '../components/new-user/new-user.component';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class NewUserService {
  api = environment.api;
  dialogRef: MatDialogRef<NewUserComponent, any> | null = null;

  /**
   * Description
   * @param {HttpClient} privatehttp
   * @param {MatDialog} privatedialog
   * @param {UserService} privateuserService
   *  */
  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private userService: UserService
  ) {}

  /**
   * Description
   * @returns {any}
   *  */
  openDialog(): void {
    const config: MatDialogConfig<number> = {
      panelClass: 'custom-dialog',
    };
    this.dialogRef = this.dialog.open(NewUserComponent, config);
  }

  /**
   * Description
   * @param {ReqUser} user
   * @returns {any}
   *  */
  callNewUsuario(user: ReqUser): Observable<ResCreateOrUpdatedUser> {
    const userData: ReqUserData = {
      data: user,
    };
    return this.http.post<ResCreateOrUpdatedUser>(
      this.api + 'usuario',
      userData
    );
  }

  /**
   * Description
   * @param {ReqUser} user
   * @returns {any}
   *  */
  newUser(user: ReqUser): void {
    this.callNewUsuario(user)
      .pipe(tap((res) => this.handleNewdUser(res)))
      .subscribe();
  }

  /**
   * Description
   * @param {ResCreateOrUpdatedUser} res
   * @returns {any}
   *  */
  handleNewdUser(res: ResCreateOrUpdatedUser): void {
    if (!res.ok) return;
    this.userService.getUsersCall();
    this.dialogRef?.close();
  }
}
