import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loader$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  showLoader(show: boolean): void {
    this.loader$.next(show);
  }

  loader(): Observable<boolean> {
    return this.loader$;
  }
}
