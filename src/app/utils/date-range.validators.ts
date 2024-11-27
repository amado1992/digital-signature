import * as moment from 'moment';

//https://stackoverflow.com/questions/61503538/custom-validator-for-date-before-in-angular
//https://stackblitz.com/edit/httpsstackoverflowcoma615036946433166?file=src%2Fapp%2Fdatepicker-overview-example.html
//https://stackoverflow.com/questions/61503538/custom-validator-for-date-before-in-angular
import { ValidatorFn, AbstractControl } from '@angular/forms';
export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const today = new Date();

    if (!(control && control.value)) {
      // if there's no control or no value, that's ok
      return null;
    }
    // Converts control value into Date Object
    //https://itsjavascript.com/javascript-typeerror-date-gettime-is-not-a-function
    const dt = new Date(control.value);
    //https://stackoverflow.com/questions/9989382/how-can-i-add-1-day-to-current-date
    // add a day
    dt.setDate(dt.getDate() + 1);
    // console.log('Control: ' + formatDate(dt));
    // console.log('Today formatted: ' + formatDate(today));
    // return null if there's no errors
    return dt <= today
      ? {
          invalidDate: `No puede especificar un valor de fecha para este campo anterior a la fecha hoy ${formatDate(
            today
          )}`,
        }
      : null;
  };
}

export function dateValidator1(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    // const today = new Date();

    if (!(control && control.value)) {
      // if there's no control or no value, that's ok
      return null;
    }

    var currentDate = new Date(); //use your date here
    currentDate.toLocaleDateString('en-US'); // "en-US" gives date in US Format - mm/dd/yy

    // let controlDate: Date = addDays(control.value, 1);
    // return null if there's no errors
    // console.log('Control: ' + formatDate(control.value.getTime()));
    // console.log('Today formatted: ' + formatDate(currentDate));

    //Using moment as date library
    //https://stackoverflow.com/questions/61503538/custom-validator-for-date-before-in-angular
    // console.log('Control: ' + moment(control.value));
    // console.log('Today formatted: ' + moment());

    return formatDate(control.value) >= formatDate(currentDate)
      ? null
      : { invalidDate: 'You cannot use pass dates' };
    // const date = moment(control.value);
    // const today = moment();
    // return date.isBefore(today)
    //   ? { invalidDate: 'You cannot use pass dates' }
    //   : null;
  };
}

function formatDate(date: any) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

function addDays(date: Date, days: number): Date {
  date.setDate(date.getDate() + days);
  return date;
}
