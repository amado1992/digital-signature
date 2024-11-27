import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { HandleErrorsService } from 'src/app/shared/services/handle-errors.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private loaderService: LoaderService,
    private handleErrorsService: HandleErrorsService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loaderService.showLoader(true);

    const token: string | null = localStorage.getItem('token');

    let request = req;

    const re = '/register';
    // const login = '/login';
    const login = '/authenticate';
    const confirm = '/confirmCreateUser'; //En un futuro no muy lejano, comentar esta linea ya que si debe incluir
    //token de seguridad por ApiClient, ver a eddy directamente.
    //Si existe el token de usuario y además la url (request) no es la de registrar usuario, pues entonces
    //incluímos el token de validación
    if (
      token &&
      req.url.search(re) === -1 &&
      req.url.search(login) === -1 &&
      req.url.search(confirm) === -1
    ) {
      request = req.clone({
        // setHeaders: {
        //   // token: token,
        //   {Authorization: `Bearer ${token}`}
        // },
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(request).pipe(
      tap((res) => this.loaderService.showLoader(false)),
      catchError((err) => this.handleErrorsService.handleErrors(err))
    );
  }
}
