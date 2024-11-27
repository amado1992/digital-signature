import { Injectable } from '@angular/core';
import { DialogData } from '../models/dialog';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root'
})
export class CreateUpdateRegisterService {

  constructor(private dialogService: DialogService) { }

  createUpdateRegisterConfirm(type: 'create' | 'update' | 'delete'): void {

    const typeAction = type === 'create' ? 'creado' : type === 'update' ? 'actualizado' : 'eliminado';
    const body = `Registro ${ typeAction } correctamente`;

    const data: DialogData = {
      type: 'success',
      header: 'Información',
      body
    }
    this.dialogService.openDialog( data );

  }
}
