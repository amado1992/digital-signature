import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.authService.getshowSpinner().subscribe((s) => {
      if (s === true) {
        this.spinner.show();
        setTimeout(() => {
          this.spinner.hide();
        }, 3000);
      } else {
        this.spinner.hide();
      }
    });
    //Comentado Abril 27 del 2023
    this.authService.validateLogin();
    this.authService.getIsLogged().subscribe(isLogin => {
      if(isLogin) this.router.navigate(['/']);
    });
  }
}
