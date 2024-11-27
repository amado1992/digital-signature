import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';

import { LoadingService } from './loading.service';
import { finalize } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loader: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.loader.show();
    return next.handle(req).pipe(
      finalize(() => {
        setTimeout(() => {
          this.loader.hide();
        }, 2000);
      })
    );
  }
}
