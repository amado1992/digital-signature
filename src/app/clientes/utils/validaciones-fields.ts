import { Cliente } from '../interfaces/clientes.interface';
import { FormGroup, ValidatorFn } from '@angular/forms';

/**
 * Description: Function para verificar disponibilidad de username tecleado por el usuario
 * @param {Event} event
 * @returns {any}
 *  */
export function checkEmailAvailability(
  event: Event,
  ClientesList: Cliente[],
  componentForm: FormGroup,
  emailFieldErrorMsg: string
) {
  let email = (event.target as HTMLInputElement).value;
  let result = ClientesList.filter(
    (item: Cliente) => item.contactEmail === email
  );
  console.log(result.length);
  if (result.length === 1) {
    componentForm.controls['email'].setErrors({ incorrect: true });
    emailFieldErrorMsg = `El correo electrónico <strong>${email}</strong> ya ha sido especificado previamente para otro cliente, por favor, especifique uno diferente.`;
  } else {
    emailFieldErrorMsg = 'Correo electrónico requerido';
  }
}

export function MyAwesomeRangeValidator(fg: FormGroup) {
  const start = fg.get('rangeStart')!.value;
  const end = fg.get('rangeEnd')!.value;
  return start !== null && end !== null && start < end ? null : { range: true };
}
