import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-validation-messages',
  templateUrl: './validation-messages.component.html',
  styleUrls: ['./validation-messages.component.scss'],
})
export class ValidationMessagesComponent implements OnInit {
  @Input() fieldToValidate!: string | (string | number);
  @Input() msgRequired: String = '';
  @Input() msgPattern: String = '';
  @Input() msgIncorrect: String | null = '';
  @Input() msgMinLength: String | null = '';
  @Input() msgMaxLength: String | null = '';
  @Input() form!: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
