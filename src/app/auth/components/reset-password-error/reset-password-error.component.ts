import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password-error',
  templateUrl: './reset-password-error.component.html',
  styleUrls: ['./reset-password-error.component.scss']
})
export class ResetPasswordErrorComponent implements OnInit {
  resetPasswForm: FormGroup = this.buildForm();
  constructor(
    private fb: FormBuilder,
    private _router: Router,
    ) { }

  ngOnInit(): void {

  }

  private buildForm(): FormGroup {
    return this.fb.group({
      email: [ '', [ Validators.email, Validators.required] ]
    });
  }

  onSubmit(): void {
    this._router.navigate(['/login']);
  }
}
