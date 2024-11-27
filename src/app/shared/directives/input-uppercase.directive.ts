import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[inputUppercase]'
})
export class InputUppercaseDirective {

  constructor(private readonly control: NgControl) { }

  @HostListener('input', ['$event.target'])
  public onInput(input: HTMLInputElement): void {
    if(!this.control) return;
   const caretPos = input.selectionStart;
    this.control?.control?.setValue(input.value.toUpperCase());
    input.setSelectionRange(caretPos, caretPos);
  }

}
