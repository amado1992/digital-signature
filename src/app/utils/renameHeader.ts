
export const rename = (header: string): string => {

  return replaceDic[header] ||
  header.split('_')
  .map(h => h.charAt(0)
  .toUpperCase() + h.slice(1))
  .join().replace(',', ' ');

  return header;
}

const replaceDic: {[T: string]: string} = {
  ce_be: 'Ce_Be',
  delegacion: 'Delegación',
  aparcamiento: 'Aparcamiento',
  cod_postal: 'Código Postal',
  direccion: 'Dirección',
  tipologia: 'Tipología',
  subtipologia: 'Subtipología',
  regimen: 'Régimen',
  duracion: 'Duración',
  fec_ini_plazo: 'Fecha Inicio Plazo',
  fec_fin_plazo: 'Fecha Fin Plazo',
  plaz_rotacion: 'Plazas Rotación',
  plaz_reales_rotacion: 'Plazas Reales Rotación',
  plaz_residentes: 'Plazas Residentes',
  plaz_pendit_venta: 'Plazas Pendientes de Venta',
  plaz_vendidas: 'Plazas Vendidas',
  plaz_vehelectr: 'Plazas Vehículos Eléctricos',
  plaz_vehiaparprop: 'Plazas Vehículos Aparcamiento Propietario',
  pmr: 'P.M.R.',
  //prop: 'Propietario',
  prop:'Proporción',
  codigo_tr: 'Código  Parking TR',
  codigo_cloud: 'Código Cloud',
  parkings_trafico: 'Parkings Tráfico',
  datos_estaticos: 'Datos Estáticos',
  datos_geograficos: 'Datos Geográficos',
  datos_dinamicos: 'Datos Dinámicos',
  datos_dinamicos_tr: 'Datos Dinámicos TR',
  id_delegacion: 'ID Delegación',
  id_tipologia: 'ID Tipología',
  id_subtipologia: 'ID Subtipología',
  id_regimen: 'ID Régimen',
  tipo_iva: "Tipo IVA",
  tarifa_maxima_dia: "Tarifa Máxima Diaria",
  nombre_sociedad: 'Sociedad',
  cif: 'CIF',
  codigo: 'Código'
}
