//https://github.com/dnlrbz/material-reusable-table/blob/master/src/app/table/table.component.ts
//https://www.linkedin.com/pulse/angular-reusable-table-component-using-material-felipe-borella/
//https://torsten-muller.dev/angular/creating-reusable-table-component/
//https://stackblitz.com/edit/angular-reusable-table?file=src%2Fapp%2Fcomponents%2Ftable%2Ftable.component.ts
//https://jnpiyush.medium.com/how-to-build-reusable-table-component-in-angular-7a7ce79d2754

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataPropertyGetter',
})
export class DataPropertyGetterPipe implements PipeTransform {
  transform(object: any, keyName: string, ...args: unknown[]): unknown {
    return object[keyName];
  }
}
