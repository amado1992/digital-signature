export interface Plan {
  id?: number;
  nombre: string;
  descripcion: string;
  cantCertificados: number;
  duracion: number;
  inicio: number;
  costo: number;
  cantidad_certificados: number;
  vigencia_compra: number;
  activo: boolean;
  tipoPagoDto: { id: number; descripcion: string };
  monedaDto: { id: number; descripcion: string };
  tipoPago: number;
  monedas: number;
  tipoPago1: string;
  monedas1: string;
  clients: any[];
  tipoPlan: boolean;
  tipoPlanNatural: boolean;
  cantidadFirmas: number;
}

// export interface Plan {
//   id?: number;
//   duracion: number;
//   inicio: number;
//   costo: number;
//   cantidad_certificados: number;
//   activo: boolean;
//   nombre: string;
//   descripcion: string;
//   tipoPago: Monedas;
//   monedas: Monedas;
//   asociado: boolean;
//   vencimiento: number;
//   vigenciaCompra: number;
// }

export interface Monedas {
  id: number;
  descripcion: string;
}

export interface planClienteAsociacion {
  clienteId: number;
  planId: number;
  mensaje: string;
}

export interface clienteCertificadosAsociacion {
  idClient: number;
  certificadoDtoList: { certificate_id: string }[];
  // certificadoDtoList: [
  //   {
  //     certificate_id: 'string';
  //   }
  // ];
}

export interface CertificateInfo {
  certificate_id: 'string';
  name: 'string';
}

export interface planClienteCertificadoAsociacion {
  planId: number;
  clientId: number;
  mensaje?: string;
  certificadoDtoList: { certificate_id: string; name: string }[];
}

export interface certificadoClientAsociacion {
  clienteId: number;
  planId: number;
}
