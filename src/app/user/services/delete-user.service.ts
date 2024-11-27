import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DeleteUerRes } from 'src/app/auth/models/user';
import { DialogData } from 'src/app/shared/models/dialog';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { environment } from 'src/environments/environment';
import { UpdateUserService } from './update-user.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class DeleteUserService {
  private api = environment.api;

  /**
   * Description
   * @param {HttpClient} privatehttp
   * @param {DialogService} privatedialogService
   * @param {UserService} privateuserService
   * @param {UpdateUserService} privateupdateUserService
   *  */
  constructor(
    private http: HttpClient,
    private dialogService: DialogService,
    private userService: UserService,
    private updateUserService: UpdateUserService
  ) {}

  /**
   * Description
   * @param {number} id
   * @returns {any}
   *  */
  deleteUserCall(id: number): Observable<DeleteUerRes> {
    return this.http.delete<DeleteUerRes>(`${this.api}usuario/${id}`);
  }

  /**
   * Description
   * @param {number} id
   * @returns {any}
   *  */
  deleteUser(id: number): void {
    const config: DialogData = {
      header: 'Alerta!',
      body: '¿Está seguro que desea eliminar este usuario?',
      type: 'dialog',
    };

    this.dialogService.openDialog(config).subscribe((resDialog) => {
      if (!resDialog) return;

      this.deleteUserCall(id)
        .pipe(tap((res) => this.handleDelete(res)))
        .subscribe();
    });
  }

  /**
   * Description
   * @param {DeleteUerRes} res
   * @returns {any}
   *  */
  private handleDelete(res: DeleteUerRes): void {
    if (res.ok) {
      this.userService.getUsersCall();
      this.updateUserService.dialogRef?.close();
    }
  }
}
