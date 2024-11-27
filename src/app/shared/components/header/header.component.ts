import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  usuario: string = '';
  @HostBinding('class') className = '';
  toggleControl = new FormControl(false);
  @Input() headerText: String = '';
  /**
   * Description
   * @param {AuthService} privateauthService
   *  */
  constructor(
    private authService: AuthService, // private themeService: ThemeService
    private router: Router,
    private overlay: OverlayContainer
  ) {}

  /**
   * Description
   * @returns {any}
   *  */
  private isAuthenticatedUser() {
    this.authService.getIsLogged().pipe(
      tap((res) => {
        if (!res) {
          this.router.navigate(['/login']);
          return;
        }
      })
    );
  }

  ngOnInit(): void {
    this.usuario = localStorage.getItem('username')!;
    this.isAuthenticatedUser();
    // this.toggleControl.valueChanges.subscribe((darkMode) => {
    //   const darkClassName = 'darkMode';
    //   this.className = darkMode ? darkClassName : '';
    //   if (darkMode) {
    //     this.overlay.getContainerElement().classList.add(darkClassName);
    //   } else {
    //     this.overlay.getContainerElement().classList.remove(darkClassName);
    //   }
    // });
  }

  /**
   * Description
   * @returns {any}
   *  */
  logout(): void {
    this.authService.logout();
  }

  /**
   * Description
   * @returns {any}
   *  */
  gotoProfile(): void {
    this.router.navigate(['/dashboard/profile']);
    // this.router.navigate(['/../..']);
  }

  changePasswordDialog(): void {
    // this.passwordService.openDialog();
  }
}
