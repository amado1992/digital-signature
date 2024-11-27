//https://code-maze.com/angular-email-confirmation-aspnet-identity/
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss'],
})
export class EmailConfirmationComponent implements OnInit {
  showSuccess?: boolean;
  msgSuccess!: { data: string; status: string };
  showError?: boolean;
  errorMessage!: string;
  token!: string;

  constructor(
    private _authService: AuthService,
    private _route: ActivatedRoute
  ) {}

  /**
   * Description
   * @returns {any}
   *  */
  ngOnInit(): void {
    this._route.queryParams.subscribe((params) => {
      this.token = params['token'];
    });
  }

  /**
   * Description
   * @returns {any}
   *  */
  public confirmEmail = () => {
    this.showError = this.showSuccess = false;
    console.log(`token: ${this.token}`);

    let token = {
      token: this.token,
    };
    this._authService.confirmEmail(token).subscribe({
      next: (_resp: any) => {
        this.msgSuccess = _resp;
        this.showSuccess = true;
      },
      error: (err: HttpErrorResponse) => {
        this.showError = true;
        this.errorMessage = err.error.message;
      },
    });
  };
}
