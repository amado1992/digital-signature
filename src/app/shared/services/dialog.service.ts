import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, take } from 'rxjs';
import { DialogComponent } from '../components/dialog/dialog.component';
import { DialogData } from '../models/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openDialog( data: DialogData ): Observable<boolean> {

    const config: MatDialogConfig = {
      data,
      autoFocus: false,
      disableClose: true,
      panelClass: 'custom-dialog'
    }

    return this.dialog.open( DialogComponent, config )
    .afterClosed()
    .pipe(
      take(1)
    );

  }

}
