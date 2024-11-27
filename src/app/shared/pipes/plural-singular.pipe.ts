//https://stackoverflow.com/questions/51621588/grammatically-correct-plural-singular-endings
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluralSingular',
})
export class PluralSingularPipe implements PipeTransform {
  transform(
    number: number,
    singularText: string,
    pluralText: string = ''
  ): string {
    let pluralWord = pluralText ? pluralText : `${singularText}s`;
    return number > 1 ? `${number} ${pluralWord}` : `${number} ${singularText}`;
  }
}
