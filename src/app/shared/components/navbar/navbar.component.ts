import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
// import { User } from 'src/app/auth/models/user';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/users/interfaces/user.interface';
import { PasswordService } from '../../services/password.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isAdmin$: Observable<boolean>;
  user$: Observable<User | null>;

  constructor(
    private passwordService: PasswordService,
    private authService: AuthService
    ) {
    this.isAdmin$ = this.authService.getIsAdmin();
    this.user$ = this.authService.getUserLogged();
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout();
  }

  changePasswordDialog(): void {
    this.passwordService.openDialog();
  }

}
