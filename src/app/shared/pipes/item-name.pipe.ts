import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'itemName'
})
export class ItemNamePipe implements PipeTransform {

  transform( head: string, table: any ): string {

    return  table[head] || '';
  }

}
