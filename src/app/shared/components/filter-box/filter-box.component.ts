import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.scss'],
})
export class FilterBoxComponent implements OnInit {
  searchText!: string;
  @Input() placeholder!: string;
  @Input() isBtnVisible: boolean = false;
  // @Input() clicCallback = new EventEmitter<any>();
  @Input() public printValue!: (param: any) => void | undefined;
  @Output() onKeyUp: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  /**
   * Description: Function para emitir un valor desde este componente hacia el componente que lo invoca
   * @returns {any}
   *  */
  emiteTerminoFromInput(): void {
    this.onKeyUp.emit(this.searchText);
  }

  // onClic() {
  //   this.clicCallback.emit('Clic');
  // }
}
