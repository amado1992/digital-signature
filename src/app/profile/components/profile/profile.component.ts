import { Component, OnInit } from '@angular/core';
import { Rol } from '../../../auth/models/login';
import { Cliente } from '../../../assigners/interfaces/assigners.interface';
import { MisPlanesService } from 'src/app/mis-planes/service/mis-planes.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  stringObject: any;
  username: string = '';
  state: any;
  email: any;
  rol!: any[];
  client!: Cliente | null;
  isAdminUser!: boolean;
  hiddenLoading!: boolean;

  constructor(readonly service: MisPlanesService) {}

  ngOnInit(): void {
    this.hiddenLoading = false;
    setTimeout(() => {
      this.hiddenLoading = true;
    }, 2000);
    if (localStorage.getItem('clientId')) {
      var newInt = +localStorage.getItem('clientId')!;
      this.service.fetchList(newInt);
      this.service.fetchClientData(newInt);
    } else {
      //Sino se encuentra la key 'clientId' en el localStorage, pues actualizamos el estado de la proerty items$
      this.service.items$.next([]);
      this.service.clientDetails$.next({});
    }
    this.stringObject = JSON.parse(localStorage.getItem('profile')!);
    this.username = this.stringObject.username;
    this.state = this.stringObject.inuse;
    this.email = this.stringObject.email;
    this.rol = this.stringObject.rolRequestDto;
    this.client = this.stringObject.clientDTO;

    //Se implementa la verificación de modo genérico, no importa en que posición venga el rol 'Superadmin'
    //https://stackoverflow.com/questions/8217419/how-to-determine-if-javascript-array-contains-an-object-with-an-attribute-that-e
    this.rol.filter((e) => e.name === 'Superadmin').length > 0
      ? (this.isAdminUser = true)
      : (this.isAdminUser = false);

    console.log(this.rol);
  }
}
