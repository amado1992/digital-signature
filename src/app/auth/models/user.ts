export interface UserRes {
  data: User;
  message: string;
  ok: boolean;
}

export interface User {
  apellidos: string;
  correo: string;
  idusuario?: number;
  nombre: string;
  rol: string[];
  usuario: string;
  rolRequestDto?: string[];
}

export interface ReqUserData {
  data: ReqUser;
}

export interface ReqUser extends Omit<User, 'rol'> {
  roles?: number[];
  password?: string;
}

export interface ResUpdatedUserData extends Omit<ReqUser, 'password'> {}

export interface ResCreateOrUpdatedUser {
  data: ResUpdatedUserData;
  message: string;
  ok: boolean;
}

export interface DeleteUerRes {
  data: {};
  message: string;
  ok: boolean;
}
