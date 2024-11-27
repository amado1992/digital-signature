import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../models/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  acceptButton = 'Aceptar'
  cancelButton = 'Cancelar'
  private _body: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<DialogComponent>
    ) { }

  ngOnInit(): void {
    this.acceptButton = this.data.acceptButton || this.acceptButton;
    this.cancelButton = this.data.cancelButton || this.cancelButton;
    this.body = this.data.body;
  }

  close( resp: boolean ): void {
    this.dialogRef.close( resp );
  }

  set body( txt: string | string[] ) {

    if( typeof txt === 'string' ) {
      this._body.push( txt );
    } else {

      this._body = <string[]>txt;
    }
  }

  get body(): string[] {
    return this._body;
  }

}
