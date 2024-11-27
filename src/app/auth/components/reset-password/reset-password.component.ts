import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResetPasswordService } from '../../services/reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswForm: FormGroup = this.buildForm();

  constructor(
    private fb: FormBuilder,
    private resetP : ResetPasswordService
    ) { }

  ngOnInit(): void {

  }

  private buildForm(): FormGroup {
    return this.fb.group({
      email: [ '', [ Validators.email, Validators.required] ]
    });
  }

  onSubmit(): void {
    let userData = {
      email: this.email?.value
    }
    console.log(this.resetPasswForm.value);
    this.resetP.EnviarEmail(userData);
  }

  get email() {
    return this.resetPasswForm.get('email');
  }

}
