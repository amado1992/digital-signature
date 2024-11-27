import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { whiteSpaces } from 'src/app/utils/validation-forms';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';
//Custom observable
import { delay, from, Observable, of, take, tap } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageMap } from '@ngx-pwa/local-storage';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  // styleUrls: ['./login-form.component.scss'],
  styles: [
    `
      /* @import '~@angular/material/prebuilt-themes/deeppurple-amber.css'; */
      /* Set a style for all buttons */
      button {
        background-color: #2f46a3;
        color: white;
        padding: 14px 10px;
        margin: 0px 0;
        border: none;
        cursor: pointer;
        width: 100%;
        font: 300 16px/20px Roboto, 'Helvetica Neue', sans-serif;
      }

      /* Add a hover effect for buttons */
      button:hover {
        opacity: 0.8;
      }

      custom-dialog {
        background: linear-gradient(135deg, #43ab34, #2f46a3);
      }
    `,
  ],
})
export class LoginFormComponent implements OnInit {
  //Codigo alain
  // Note that the parameter here relates to the #listItem in the template.
  @ViewChild('ipt', { static: false }) div!: ElementRef;
  // private myarray: string[] = ["test", "test2", "test3"]
  // array1: Observable<string[]> = of(this.myarray).pipe(delay(5000));
  // private showSpinner$ = new BehaviorSubject<boolean>(false);
  //According to: https://www.digitalocean.com/community/tutorials/css-animate-css
  animations: string[] = ['animate__animated', 'animate__heartBeat'];
  //Codigo alain
  loginForm: FormGroup = this.buildForm();

  //https://github.com/cyrilletuzi/angular-async-local-storage/blob/main/docs/WATCHING.md
  data: string | undefined;
  dataSubscription: Subscription | undefined;

  /**
   * Description
   * @param {FormBuilder} privatefb
   * @param {AuthService} privateauthService
   * @param {Router} privaterouter
   *  */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private storageMap: StorageMap
  ) {}

  @HostListener('window:storage')
  onStorageChange() {
    console.log('change...');
    console.log(localStorage.getItem('userInvalid'));
  }

  /**
   * Description
   * @returns {any}
   *  */
  ngOnInit(): void {
    this.storageMap.delete('userInvalid').subscribe(() => {});
    this.dataSubscription = this.storageMap
      .watch('userInvalid', { type: 'string' })
      .subscribe((result: string | undefined) => {
        setTimeout(() => {
          this.data = result;
        }, 3000);
        console.log(this.data);
      });
  }

  /**
   * Description
   * @returns {any}
   *  */
  ngOnDestroy(): void {
    this.dataSubscription!.unsubscribe();
  }

  /**
   * Description
   * @returns {any}
   *  */
  private buildForm(): FormGroup {
    return this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, whiteSpaces]],
    });
  }

  /**
   * Description
   * @returns {any}
   *  */
  onSubmit(): void {
    //Por testear una vez se encuentre disponible el Rest Api
    this.authService.login(this.loginForm.value);

    //Codigo alain
    // this.spinner.show();
    // setTimeout(() => {
    //     /** spinner ends after 5 seconds */
    //     this.spinner.hide();
    //     this.router.navigate(['/search']);
    // }, 5000);
    // this.showSpinner$.next(true);
    // this.array1.subscribe(item => {
    //   console.log(item);
    //   this.showSpinner$.next(false);
    //   });
    // this.router.navigate(['/search']);
    //Codigo alain
  }

  /**
   * Description
   * @returns {any}
   *  */
  get username() {
    return this.loginForm.get('username');
  }

  /**
   * Description
   * @returns {any}
   *  */
  get password() {
    return this.loginForm.get('password');
  }

  /**
   * Description
   * @param {any} event
   * @returns {any}
   *  */
  onFocusOutEvent(event: any) {
    if (event.target.value === '') {
      // console.log('Empty value');
      // this.input.nativeElement.value = "test!";
      // this.div.nativeElement.style.display='none';
      // this.div.nativeElement.style.display='block';s
      this.div.nativeElement.classList.remove(...this.animations);
      this.div.nativeElement.classList.add(...this.animations);
      //this.div.nativeElement.classList.add('animate__animated', 'animate__heartBeat');
      // this.listItems.classList.add('animate__animated', 'animate__bounceOutLeft');
      // const element = document.querySelector(event.target);
      // console.log(element);
      //element!.classList.add('animate__animated', 'animate__bounceOutLeft');
    }
    // else console.log(event.target.value);
  }
}
