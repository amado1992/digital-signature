import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Permiso } from 'src/app/assigners/interfaces/assigners.interface';

@Component({
  selector: 'app-loading-panel',
  templateUrl: './loading-panel.component.html',
  styleUrls: ['./loading-panel.component.scss'],
})
export class LoadingPanelComponent implements OnInit {
  @Input() bs!: Observable<any[]> | undefined;
  @Input() array!: any[] | undefined;
  @Input() divListado!: TemplateRef<any>;
  constructor() {}

  ngOnInit(): void {}
}
