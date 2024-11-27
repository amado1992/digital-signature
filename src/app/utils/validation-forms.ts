import { ValidatorFn, AbstractControl, ValidationErrors, FormGroup, Validators } from "@angular/forms";

//**Valida que no existan espacios en blanco. */
export let whiteSpaces: ValidatorFn = (control: AbstractControl):  ValidationErrors | null => {
  if(!control?.value) return null;
  let pass = (<string>control.value).includes(' ');
  return !pass ? null : { notwhiteSpaces: true };
}

//**Verifica si es un correo válido */
export let validateEmail: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const email: string = control.value;
  const emailRE: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRE.test(email) ? null : { notValidEmail: true };
}

//**Compara que dos inputs sean iguales.*/
export let compareInputs = (controlName1: string, controlName2: string): ValidatorFn => {
  return (group: AbstractControl):  ValidationErrors | null => {
    let control1 = group.get(controlName1)?.value;
    let control2 = group.get(controlName2)?.value;
    return control1 === control2 ? null : { notSameValues: true };
  }
}


/*Valida una contraseña: 
  * 1 mayúscula
  * 1 carácter especial
  * 1 número. 
  * 10 longitud mínimo*/
export let validPassword: ValidatorFn = (control: AbstractControl):  ValidationErrors | null => {
  const pass: string = control.value;
  const passRE: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\[\]\{\}_\-\/\\#=.@$!%*?&])[A-Za-z\d\[\]\{\}_\-\/\\#=.@$!%*?&]{8,}$/;
  return passRE.test(pass) ? null : { notValidPassword: true };
}

 //validación en la tabla Datos Dinámicos. Si el campo duracion es llenado, los campos
 //fec_ini_plazo y fec_fin_plazo serán obligatorios
export let duracionValidator = (controls: FormGroup): ValidationErrors | null => {

  if(controls.get('duracion')?.value && !controls.get('fec_ini_plazo')?.hasValidator(Validators.required) && !controls.get('fec_fin_plazo')?.hasValidator(Validators.required)) {
    console.log('ENTRA**');
    controls.get('fec_ini_plazo')?.setValidators(Validators.required);
    controls.get('fec_fin_plazo')?.setValidators(Validators.required);

    controls.get('fec_ini_plazo')?.updateValueAndValidity();
    controls.get('fec_fin_plazo')?.updateValueAndValidity();
  }

  if(!controls.get('duracion')?.value && controls.get('fec_ini_plazo')?.hasValidator(Validators.required)) {
    controls.get('fec_ini_plazo')?.removeValidators(Validators.required);
    controls.get('fec_ini_plazo')?.updateValueAndValidity();
  }

  if(!controls.get('duracion')?.value && controls.get('fec_fin_plazo')?.hasValidator(Validators.required)) {
    controls.get('fec_fin_plazo')?.removeValidators(Validators.required);
    controls.get('fec_fin_plazo')?.updateValueAndValidity();
  }

  return null;
}
