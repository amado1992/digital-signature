import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import * as customValidators from 'src/app/utils/validation-forms';
import { PasswordComponent } from '../password/password.component';

@Component({
  selector: 'app-form-password',
  templateUrl: './form-password.component.html',
  styleUrls: ['./form-password.component.scss']
})
export class FormPasswordComponent implements OnInit {

  formPassword: FormGroup;
  @Output() password$ = new EventEmitter<string>();

  constructor(
    private dialogRef: MatDialogRef<PasswordComponent>,
    private fb: FormBuilder) {
    this.formPassword = this.fb.group({
      password1: ['', [ Validators.required, customValidators.whiteSpaces, Validators.minLength(8) ]],
      password2: ['', Validators.required]
    }, { validators: [ customValidators.compareInputs('password1', 'password2') ]});
  }

  ngOnInit(): void {
  }

  save(): void {
    if(this.formPassword.invalid) return;
    this.password$.emit(this.formPassword.get('password1')?.value)
  }

  close(): void {
    this.dialogRef.close();
  }

}
