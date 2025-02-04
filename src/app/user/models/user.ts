
// Generated by https://quicktype.io

export interface UsersRes {
  data:    User[];
  message: string;
  ok:      boolean;
}

export interface User {
  apellidos: string;
  correo:    string;
  idusuario: number;
  nombre:    string;
  roles:     string[];
  usuario:   string;
}

export interface UserFront extends Omit<User, 'roles'>  {
  roles: string
}

