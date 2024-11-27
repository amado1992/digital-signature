import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
// import { User } from 'src/app/auth/models/user';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/users/interfaces/user.interface';
import { PasswordService } from '../../services/password.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {
  user$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private passwordService: PasswordService
  ) {
    this.user$ = this.authService.getUserLogged();
  }

  ngOnInit(): void {}

  save(password: string): void {
    // console.log(password);
    this.passwordService.updateUserPassword(password);
  }
}
