import { Component, OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { LoaderService } from './shared/services/loader.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  showLoader$: Observable<boolean>;

  /**
   * Description
   * @param {LoaderService} loaderService
   *  */
  constructor(public loaderService: LoaderService, public auth: AuthService) {
    this.showLoader$ = this.loaderService.loader();
  }
  ngOnDestroy(): void {
    this.auth.logout();
  }

  title = 'eFirma';
}
