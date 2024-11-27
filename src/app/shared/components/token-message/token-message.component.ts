//https://www.roboleary.net/2022/01/13/copy-code-to-clipboard-blog.html
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-token-message',
  templateUrl: './token-message.component.html',
  styleUrls: ['./token-message.component.scss'],
})
export class TokenMessageComponent implements OnInit {
  isDisable!: boolean;

  constructor(
    public sbRef: MatSnackBarRef<TokenMessageComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private _snackBar1: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isDisable = true;
  }

  //   sbRef.afterDismissed().subscribe(info => {
  //   if (info.dismissedByAction === true) {
  //     // your code for handling this goes here
  //   }
  // });

  cliqboardClicEvent(): void {
    this.isDisable = false;
    // this.openSnackBar('¡Token copiado!', 'Listo !!!!!');
  }

  openSnackBar(message: string, action: string) {
    this._snackBar1.open(message, action, {
      duration: 4000,
    });
  }
}
