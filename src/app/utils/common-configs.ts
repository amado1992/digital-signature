import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

export const commonConfig: any = {
  border: '3px solid white',
  allowOutsideClick: false,
  allowEscapeKey: false,
  // showClass: {
  //   popup: 'animate__animated animate__fadeIn animate__faster',
  // },
  // hideClass: {
  //   popup: 'animate__animated animate__fadeIn animate__faster',
  // },
};

//https://stackoverflow.com/questions/57700078/angular-material-mat-table-not-returning-any-results-upon-filter
//also add this nestedFilterCheck class function
export function nestedFilterCheck(search: any, data: any, key: any) {
  if (typeof data[key] === 'object') {
    for (const k in data[key]) {
      if (data[key][k] !== null) {
        search = nestedFilterCheck(search, data[key], k);
      }
    }
  } else {
    search += data[key];
  }
  return search;
}

/**
 * Description: Function para leer contenido de fichero seleccionado
 * @param {File} file
 * @returns {any}
 *  */
export function readFileContent(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (!file) {
      resolve('');
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = reader.result!.toString();
      resolve(text);
    };

    reader.readAsText(file);
  });
}

/**
 * Description
 * @param {any} input
 * @returns {any}
 */
export function useRegex(input: any) {
  let regex = /^([a-z]+( [a-z]+)+).*[a-z]\s\|\s([a-z0-9]+(-[a-z0-9]+)+)$/i;
  return regex.test(input);
}

/**
 * Description
 * @param {any} input
 * @returns {any}
 */
export function useRegexAvoidZeroAtbeginning(input: any) {
  let regex = /^((?!(0))[1-9][0-9]{1,2})$/;
  return regex.test(input);
}

/**
 * Description: Elimina un item de un array
 * https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
 * @param {Array<T>} arr
 * @param {T} value
 * @returns {any}
 *  */
export function removeItem<T>(arr: Array<T>, value: T): Array<T> {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

/**
 * Description
 * @param {Date} d1
 * @param {Date} d2
 * @returns {any}
 */
export function diffDays(d1: Date, d2: Date) {
  var ndays;
  var tv1 = d1.valueOf(); // msec since 1970
  var tv2 = d2.valueOf();

  ndays = (tv2 - tv1) / 1000 / 86400;
  ndays = Math.round(ndays - 0.5);
  return ndays;
}

/**
 * Description
 * @param {Date} StartDate
 * @param {Date} EndDate
 * @returns {any}
 */
export function DaysBetween(StartDate: Date, EndDate: Date): number {
  // The number of milliseconds in all UTC days (no DST)
  const oneDay = 1000 * 60 * 60 * 24;

  // A day in UTC always lasts 24 hours (unlike in other time formats)
  const start = Date.UTC(
    EndDate.getFullYear(),
    EndDate.getMonth(),
    EndDate.getDate()
  );
  const end = Date.UTC(
    StartDate.getFullYear(),
    StartDate.getMonth(),
    StartDate.getDate()
  );

  // so it's safe to divide by 24 hours
  return (start - end) / oneDay;
}

/**
 * Description
 * @param {any} date1
 * @param {any} date2
 * @returns {any}
 */
export function days_between(date1: any, date2: any) {
  // The number of milliseconds in one day
  const ONE_DAY = 1000 * 60 * 60 * 24;

  // Calculate the difference in milliseconds
  const differenceMs = Math.abs(date1 - date2);

  // Convert back to days and return
  return Math.round(differenceMs / ONE_DAY);
}

/**
 * According to https://stackblitz.com/edit/angular-5mgfxh?file=app%2Fdutch-paginator-intl.ts
 * Description: Traductor para la propiedad getRangeLabel del objeto _MatPaginatorIntl
 * @param {number} page
 * @param {number} pageSize
 * @param {number} length
 * @returns {any}
 */
export const esRangeLabel = (
  page: number,
  pageSize: number,
  length: number
) => {
  if (length == 0 || pageSize == 0) {
    return `0 van ${length}`;
  }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex =
    startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} de ${length}`;
};

/**
 * Description: Function para el tratamiento de errores retornados desde el servidor, en cada petición realizada a los endpoints del sistema
 * @param {HttpErrorResponse} err
 * @returns {any}
 *  */
export function handlerResponseError(err: HttpErrorResponse): void {
  if (err.error instanceof Error) {
    //A client-side or network error occurred.
    // console.log('An error occurred:', err.error.message);
    Swal.fire({
      title: '¡Ha ocurrido el siguiente error!',
      html: ` ${err.error.message} `,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      ...commonConfig,
    });
  } else {
    //Backend returns unsuccessful response codes such as 404, 500 etc.
    // console.log('Backend returned status code: ', err.status);
    // console.log('Response body:', err.error);
    Swal.fire({
      title: '¡Ha ocurrido el siguiente error!',
      // html: `Código de error: ${err.status}, ${err.error.errorMessage} `,
      html: `Error: <strong>${err.status}</strong>: <div style="text-align: justify;">${err.error.errorMessage}</div>. `,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      ...commonConfig,
    });
  }
}

/**
 * Description
 * @returns {any}
 */
export function getToken(): string {
  return localStorage.getItem('token')!;
}

/**
 * Description: Generate a SHA-256 hash
 * https://remarkablemark.medium.com/how-to-generate-a-sha-256-hash-with-javascript-d3b2696382fd
 * @param {string} message
 * @returns {any}
 *  */
export async function sha256(message: string) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);
  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  // convert bytes to hex string
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

//https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function dec2hex(dec: any) {
  return dec.toString(16).padStart(2, '0');
}

export function generateId(len: number) {
  var arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
}

export function randomString(length: number) {
  var randomChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}
