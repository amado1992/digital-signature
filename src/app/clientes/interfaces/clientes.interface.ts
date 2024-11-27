import { User } from 'src/app/users/interfaces/user.interface';

export interface Cliente {
  id?: number;
  description: string;
  direccion: string;
  lastName: string;
  name: string;
  province: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  institutional: boolean;
  country: string;
  usuario: User[];
  nombreCorto: string;
  codigoReeup: string;
  telefono: number; // revisar sentido de tener ambos campos??
  identificador: number; // /??
  pais: number;
  fechaCreacion: number;
  ci: number;
  datosBancariosDtoList: DatoBancario[];
  username: any
  // {
  //   id: number;
  //   cuentaBancaria: string;
  //   nombre: string;
  //   titular: string;
  //   observaciones: string;
  //   monedas: {
  //     id: number;
  //     descripcion: string;
  //   };
  //   nombreBanco: string;
  //   sucursal: string;
  // }
}

export interface DatoBancario {
  id?: number;
  cuentaBancaria: string;
  nombre: string;
  titular: string;
  observaciones: string;
  moneda: denom;
  monedas: denom;
  nombreBanco: string;
  sucursal: string;
}

export interface denom {
  id: number;
  descripcion: string;
}

export interface DatoBancarioCliente {
  datoBancarioId: number;
  clientId: number;
}

export class CreateUser{
  username: any
  email: any
  usuarioId: any
  password: any
  listRoles: any[] = []
}