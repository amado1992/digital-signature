//According to https://stackblitz.com/edit/angular-highlight-pipe?file=src%2Fapp%2Fapp.component.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any, args: any): any {
    if (!args) {
      return value;
    }
    // Match in a case insensitive maneer
    const re = new RegExp(args, 'gi');
    const match = String(value).match(re);

    // If there's no match, just return the original value.
    if (!match) {
      return value;
    }

    const replacedValue = String(value).replace(
      re,
      '<span class="highlight">' + match[0] + '</span>'
    );
    return this.sanitizer.bypassSecurityTrustHtml(replacedValue);
    // return replacedValue;
  }
}
