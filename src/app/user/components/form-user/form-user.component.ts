import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ReqUser, User } from 'src/app/auth/models/user';
import * as customValidators from 'src/app/utils/validation-forms';
import { DeleteUserService } from '../../services/delete-user.service';
import { UpdateUserComponent } from '../update-user/update-user.component';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss']
})
export class FormUserComponent implements OnInit, OnChanges {

  @Input() user: User | null = null;
  @Output() newUser = new EventEmitter<ReqUser>();

  userForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<UpdateUserComponent>,
    private fb: FormBuilder,
    private deleteUserService: DeleteUserService
    ) {

    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [
        Validators.required,
        customValidators.validateEmail]
      ],
      password1: ['', [
        Validators.required,
        customValidators.whiteSpaces,
        customValidators.validPassword,
        Validators.minLength(10)
      ]],
      password2: ['', [Validators.required]],
      changePassword: [false],
      rol: ['User']
    }, { validators: [customValidators.compareInputs('password1', 'password2')] });
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {

    this.userForm.get('changePassword')?.valueChanges.subscribe(val => {
      if(val){
        this.userForm.get('password1')?.reset();
        this.userForm.get('password2')?.reset();
      }
    });

    if(changes['user'].currentValue) {
      this.loadDataForm( changes['user'].currentValue );
    }
  }

  save(): void {

    const { name, lastname, username, email } = this.userForm.value;
    const newUser: ReqUser = {
      nombre: name,
      apellidos: lastname,
      usuario: username,
      correo: email,
      roles: []
    }

    if (this.userForm.get('rol')?.value === 'Admin') {
      newUser?.roles?.push(1);
    } else {
      newUser?.roles?.push(2);
    }

    if((this.user && this.userForm.get('changePassword')?.value) || !this.user) {
      newUser.password = this.userForm.get('password1')?.value;
    }

    this.newUser.next(newUser);
  }

  close(): void {
    this.dialogRef.close();
  }

  loadDataForm(user: User): void {
    if (!user) return;
    this.userForm.get('name')?.setValue(user?.nombre);
    this.userForm.get('lastname')?.setValue(user?.apellidos);
    this.userForm.get('username')?.setValue(user?.usuario);
    this.userForm.get('email')?.setValue(user?.correo);
    this.userForm.get('rol')?.setValue(user.rol.includes('User') ? 'User' : 'Admin' );
  }

  validForm(): boolean {
    return (this.userForm.valid && !this.user &&
           (this.userForm.get('rol')?.value))
           ||
           (this.user && this.userForm.get('changePassword')?.value
           && this.userForm.valid &&
           (this.userForm.get('rol')?.value))
           ||
           (this.user && !this.userForm.get('changePassword')?.value
           && this.userForm.get('name')?.valid
           && this.userForm.get('lastname')?.valid
           && this.userForm.get('username')?.valid
           && this.userForm.get('email')?.valid
           && (this.userForm.get('rol')?.value));
  }

  delete(): void {
    if(!this.user?.idusuario) return;
    this.deleteUserService.deleteUser(this.user.idusuario);
  }

}
