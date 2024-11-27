import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  styles: [
    `
      /* @import url('https://fonts.googleapis.com/css2?family=Poppings:wght@300;400;500;600;700&display=swap'); */

      .nav-link:hover,
      .nav-link:focus {
        background-color: #2f46a3;
        border-radius: 6px;
      }

      .nav-link {
        border-radius: 6px;
      }

      .nav-link a:hover,
      .nav-link:focus {
        color: white;
      }

      // //li seleccionado o activo
      .nav-link a:focus {
        //     // color: #4a4dc4;
        color: white;
      }

      // //Color del texto
      .nav-link a {
        color: #525f7f;
      }

      // //Lo encontré, li activo
      li a.active {
        background-color: #2f46a3;
        color: white;
      }

      li a:hover:not(.active) {
        background-color: #2f46a3;
        color: white;
      }

      // //Lo encontré, li activo

      ul {
        list-style-type: none;
      }

      .nav-link .material-icons,
      .nav-link a {
        display: inline-block;
        vertical-align: middle;
      }

      .material-icons {
        font-size: 25px; //icon size
        margin-right: 7px;
        color: #16192c;
        font-family: 'Material Icons' !important; //Yes, awesome job!!!!
      }

      * {
        font-family: 'Poppins', sans-serif;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      :root {
        /* Colors  */
        --body-color: #e4e9f7;
        --sidebar-color: #fff;
        --primary-color: #695cfe;
        --primary-color-light: #f6f5ff;
        --toggle-color: #ddd;
        --text-color: #707070;

        /* Transicions */
        --tran-02: all 0.2s ease;
        --tran-03: all 0.3s ease;
        --tran-04: all 0.4s ease;
        --tran-05: all 0.5s ease;
      }

      body {
        height: 100vh;
        background: var(--body-color);
        transition: var(--tran-05);
      }

      body.dark {
        --body-color: #18191a;
        --sidebar-color: #242526;
        --primary-color: #3a3b3c;
        --primary-color-light: #3a3b3c;
        --toggle-color: #fff;
        --text-color: #ccc;
      }

      /* Reusable Css */

      /* Reusable Css */

      /* Sidebar Css */
      /* Sidebar Css */
      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 250px;
        padding: 10px 14px;
        background: var(--sidebar-color);
        transition: var(--tran-05);
        z-index: 100;
      }
      ///////////////////////////////////////////////////////////////////////////
      /* List items that are children of the "my-things" list */
      ul.my-things > li {
        margin: 2em;
      }
      .sidebar .tooltip {
        display: block;
      }

      .sidebar.collapsed .tooltip {
        transition: opacity 0.3s ease-in-out;
        display: inline;
        visibility: hidden;
        opacity: 0;
        position: absolute;
        left: 5em;
        margin: 0;
        margin-top: 0.6em;
      }

      .sidebar .close .menu-item-area:hover .tooltip {
        visibility: visible;
        opacity: 1;
      }

      .sidebar .close .tooltip .tooltipContent {
        overflow: hidden;
        position: relative;
        color: #fff;
        background-color: #8e204d;
        padding: 0.2em 1em;
        border-radius: 5px;
      }
      ///////////////////////////////////////////////////
      .sidebar.close {
        width: 88px;
      }

      .sidebar .text {
        /* font-size: 16px;
        font-weight: 500;
        color: var(--text-color);
        transition: var(--tran-03);
        white-space: nowrap;
        opacity: 1; */
        font-size: 17px;
        font-weight: 500;
        white-space: nowrap;
        opacity: 1;
      }

      .sidebar.close .text {
        opacity: 0;
      }

      /* .sidebar.close li {
        z-index: 999999;
        opacity: 1;
      } */

      .sidebar .image {
        min-width: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .sidebar li {
        height: 50px;
        margin-top: 10px;
        list-style: none;
        display: flex;
        align-items: center;
      }

      .sidebar header .image,
      .sidebar .icon {
        min-width: 60px;
        border-radius: 6px;
      }

      .sidebar .icon {
        min-width: 60px;
        border-radius: 6px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }

      .sidebar .text,
      .sidebar .icon {
        color: var(--text-color);
        transition: var(--tran-03);
      }

      .sidebar li .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 60px;
        font-size: 20px;
      }

      .sidebar li .icon,
      .sidebar li .text {
        color: var(--text-color);
        transition: var(--tran-03);
      }

      .sidebar header {
        position: relative;
      }

      .sidebar header .image-text {
        display: flex;
        align-items: center;
      }

      .sidebar header .logo-text {
        display: flex;
        flex-direction: column;
      }

      header .image-text .name {
        margin-top: 2px;
        font-size: 18px;
        font-weight: 600;
      }

      header .image-text .profession {
        font-size: 16px;
        margin-top: -2px;
        display: block;
      }

      .sidebar header .image {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .sidebar header .image img {
        width: 40px;
        border-radius: 6px;
      }

      .sidebar .image-text img {
        width: 40px;
        border-radius: 6px;
      }

      header .image-text .header-text {
        display: flex;
        flex-direction: column;
      }

      .header-text .name {
        font-weight: 600;
      }

      .header-text .profession {
        margin-top: -2px;
      }

      .sidebar header .toggle {
        /* position: absolute;
        top: 50%;
        right: -25px;
        cursor: pointer;
        transform: translateY(-50%) rotate(180deg);
        height: 25px;
        width: 25px;
        background: var(--primary-color);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        color: var(--sidebar-color);
        font-size: 22px;
        transition: var(--tran-05); */
        position: absolute;
        top: 50%;
        right: -20px;
        transform: translateY(-50%) rotate(180deg);
        height: 25px;
        width: 25px;
        background-color: var(--primary-color);
        color: var(--sidebar-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        cursor: pointer;
        transition: var(--tran-05);
      }

      .sidebar.close header .toggle {
        transform: translateY(-50%);
      }

      body.dark .sidebar header .toggle {
        color: var(--text-color);
      }

      .sidebar .menu {
        margin-top: 30px;
        /* Centramos "justo en el centro" todos los items de navegación*/
        margin-left: 15px;
      }

      .sidebar .search-box {
        background: var(--primary-color-light);
        border-radius: 6px;
        transition: var(--tran-05);
        cursor: pointer;
      }

      .search-box input {
        height: 100%;
        width: 100%;
        outline: none;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 500;
        background: var(--primary-color-light);
        transition: var(--tran-05);
      }

      .sidebar li a {
        /* height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        text-decoration: none;
        border-radius: 6px;
        transition: var(--tran-04); */
        list-style: none;
        height: 100%;
        /* background-color: transparent; */
        display: flex;
        align-items: center;
        height: 100%;
        width: 100%;
        border-radius: 6px;
        text-decoration: none;
        transition: var(--tran-03);
      }

      .sidebar li a:hover {
        background: var(--primary-color);
      }

      .sidebar li a:hover .icon .sidebar li a:hover .text {
        color: var(--sidebar-color);
      }

      body.dark .sidebar li a:hover .icon body.dark .sidebar li a:hover .text {
        color: var(--text-color);
      }

      .sidebar .menu-bar {
        height: calc(100% - 50px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .menu-bar .mode {
        position: relative;
        border-radius: 6px;
        background: var(--primary-color-light);
      }

      .menu-bar .mode .moon-sun {
        height: 50px;
        width: 60px;
        display: flex;
        align-items: center;
      }

      .menu-bar .mode i {
        position: absolute;
        transition: var(--tran-03);
      }

      .menu-barr .mode i.sun {
        opacity: 0;
      }

      body.dark .menu-bar .mode i.sun {
        opacity: 1;
      }

      body.dark .menu-bar .mode i.moon {
        opacity: 0;
      }

      .menu-bar .mode .toggle-switch {
        position: absolute;
        right: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        min-width: 60px;
        border-radius: 6px;
        background: var(--primary-color-light);
        transition: var(--tran-05);
      }

      .toggle-switch .switch {
        position: relative;
        height: 22px;
        width: 44px;
        border-radius: 25px;
        background: var(--toggle-color);
      }

      .switch::before {
        content: '';
        position: absolute;
        height: 15px;
        width: 15px;
        border-radius: 50%;
        top: 50%;
        left: 5px;
        transform: translateY(-50%);
        background: var(--sidebar-color);
        transition: var(--tran-03);
      }

      body.dark .switch::before {
        left: 25px;
      }

      .home {
        position: relative;
        left: 250px;
        height: 90vh;
        /* background: red; */
        /* Determina el size del home, donde se encuentra nuestro querido control router-oulet */
        width: calc(100% - 15%);
        background: var(--body-color);
        transition: var(--tran-05);
      }

      .home .text {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-color);
        padding: 0px 40px;
      }

      .sidebar.close ~ .home {
        left: 88px;
        width: calc(100% - 88px);
      }
    `,
  ],
})
export class MainComponent implements OnInit {
  @ViewChild('nav') el: ElementRef | undefined;
  showMatTooltip: boolean = false;
  /**
   * Description
   * @param {AuthService} privateauthService
   *  */
  constructor(
    private authService: AuthService,
    private elementRef: ElementRef
  ) {
    this.showMatTooltip = false;
  }

  /**
   * Description: Function ngOnInit
   * @returns {any}
   *  */ ngOnInit(): void {
    //Inicializamos el estado en false para que no se muestren los tooltips de las opciones del sidebar
    this.showMatTooltip = false;
  }

  /**
   * Description: Evento ngAfterViewInit
   * https://stackoverflow.com/questions/48925353/remove-or-add-class-in-angular
   * https://stackoverflow.com/questions/42809368/angular-adding-a-class-to-a-dom-element-when-clicked
   * https://stackoverflow.com/questions/44987443/how-to-add-remove-css-class-in-angular-element
   * https://stackoverflow.com/questions/65923638/document-queryselector-in-angular
   * https://stackoverflow.com/questions/41609937/how-to-bind-event-listener-for-rendered-elements-in-angular-2
   * @returns {any}
   *  */
  ngAfterViewInit(): void {
    this.elementRef.nativeElement
      .querySelector('.toggle')
      .addEventListener('click', this.onClick.bind(this));

    // this.elementRef.nativeElement
    //   .querySelector('.toggle-switch')
    //   .addEventListener('click', this.onClickSwitch.bind(this));
  }

  /**
   * Description: Function onClickSwitch
   * @param {any} event
   * @returns {any}
   *  */
  onClickSwitch(event: any): void {
    let body = this.elementRef.nativeElement.querySelector('section');
    body.classList.toggle('dark');
  }

  /**
   * Description: Function onClick
   * @param {any} event
   * @returns {any}
   *  */
  onClick(event: any): void {
    //https://codepen.io/parfait/pen/vYLaPKJ
    let myTag = this.elementRef.nativeElement.querySelector('nav');
    let li = this.elementRef.nativeElement.querySelector('li');
    // Array.from(li.classList).includes('main-nav');
    if (Array.from(myTag.classList).indexOf('close') === -1) {
      myTag.classList += ' close';
      this.showMatTooltip = false;
      // li.className += ' tooltip tooltipContent';
    } else {
      myTag.classList = 'sidebar';
      this.showMatTooltip = true;
      // li.className = 'nav-link';
      // menuBtn.className = 'fa fa-close';
    }
    if (Array.from(myTag.classList).indexOf('close') === 1) {
      // this.showMatTooltip = true;
    }
    // myTag.classList.toggle('close');
    // console.log(event);
  }

  /**
   * Description: Function logout
   * @returns {any}
   *  */
  logout(): void {
    this.authService.logout();
  }
}
