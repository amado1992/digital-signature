export interface Cliente {
  id?: number;
  description: string;
  lastName: string;
  name: string;
  province: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  institutional: boolean;
  country: string;
}

export interface Permiso {
  id?: number;
  descripcion: string;
  operationType: string;
  nombre: string;
  avaliable: boolean;
}
