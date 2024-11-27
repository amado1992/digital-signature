import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DialogData, DialogTypes } from 'src/app/shared/models/dialog';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { RequestResetService } from '../../services/request-reset.service';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.scss']
})
export class RequestResetComponent implements OnInit, AfterViewInit {

  resetPasswForm: FormGroup = this.buildForm();
  propToken: any;
  tokenRec: string = '';

  constructor(
    private fb: FormBuilder,
    private resetP : RequestResetService,
    private jwtHelper: JwtHelperService,
    private _router: Router,
    private _route: ActivatedRoute,
    private dialogService: DialogService
    ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit()
  {
    this._route.params.subscribe(param => {
      this.tokenRec = param['token'];
      //Aqui tengo que validar el token recibido
      if (this.jwtHelper.isTokenExpired(this.tokenRec))
      {
        //Aqui tengo que mostrar mensaje y redireccionar al login
        this.dialog('Token expirado.');
        this._router.navigate(['/']);
      }
      // else 
      // {
      //   this.propToken = this.jwtHelper.decodeToken(tokenRec);
      //   //Aqui tengo el user para enviar al backend
      //   //propToken.username;
      // }
      
   });
  }

  private dialog(body: string | string[], header: string = 'Error', type: DialogTypes = 'error'): void {
    const data: DialogData = {
      header,
      body,
      type
    }
    this.dialogService.openDialog(data);
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      newPassw: [ '', [ Validators.required]],
      newPassw1: [ '', [ Validators.required]]
    });
  }

  onSubmit(): void {
    let userData = {
      password: this.newPassw?.value
    }
    console.log(this.resetPasswForm.value);
    this.resetP.EnviarNewPassword(userData, this.tokenRec);
  }

  get newPassw() {
    return this.resetPasswForm.get('newPassw');
  }

  get newPassw1() {
    return this.resetPasswForm.get('newPassw1');
  }

  get noMatchPasswords() {
    return this.newPassw?.value !== this.newPassw1?.value;
  }

}
