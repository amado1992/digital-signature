import { Injectable } from '@angular/core';
import { MisPlanesService } from 'src/app/mis-planes/service/mis-planes.service';

@Injectable({
  providedIn: 'root',
})
export class PlanesByClientesService {
  constructor(private service: MisPlanesService) {}
}
