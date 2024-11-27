import { Rol } from 'src/app/auth/models/login';

export interface User {
  id?: number;
  username: string;
  email: string;
  inuse?: number;
  password: string;
  listRoles: [];
  userRole: [];
  enable: true;
  usuarioId: number;
  clientResponse: { id: number; name: string };
  rolRequestDto: Rol[];
}
