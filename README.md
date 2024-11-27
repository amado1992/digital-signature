# eFirma-front

Este proyecto se generó con [Angular CLI](https://github.com/angular/angular-cli) version 13.3.3.

## Development server

Utilice el comando `ng serve` para lanzar un servidor de desarrollo. Abra el navegador de su preferencia y vaya a la ruta siguiente `http://localhost:4200/`. La aplicación recargará los cambios automáticamente que estos sean identificados.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Ejecute `ng build` to construir el proyecto. Los artefactos de construcción serán almacenados en el directorio `dist/`.

## Running unit tests

Utilice el comando `ng test` para ejecutar las pruebas unitarias via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

https://dev.to/oneofthedevs/docker-angular-nginx-37e4
https://medium.com/tensult/angular-material-custom-theme-implementation-in-angular-6-d424a2a47e4c
https://stackoverflow.com/questions/64510562/angular-material-component-styles-are-not-working

## Pasos para construir/publicar la aplicación eFirma (hacer un build para producción):

1- Debe posicionarce primeramente en la raíz del proyecto de angular, por ejemplo:

```sh
cd 'g:\Trabajo\Ingenius\Proyecto\eFigma\develop-branch\efigma-front-angular\'
```

2- Ejecutamos el siguiente commando tal cual se lista a continuación:

```sh
ng build --configuration production --aot=false  --build-optimizer=false
```

y debemos obtener una salida similar a la siguiente:

```sh
Your global Angular CLI version (15.1.3) is greater than your local version (13.3.3). The local Angular CLI version is used.

To disable this warning use "ng config -g cli.warnings.versionMismatch false".
Option "deployUrl" is deprecated: Use "baseHref" option, "APP_BASE_HREF" DI token or a combination of both instead. For more information, see https://angular.io/guide/deployment#the-deploy-url.
✔ Browser application bundle generation complete.
✔ Copying assets complete.
✔ Index html generation complete.

Initial Chunk Files           | Names                                        |  Raw Size | Estimated Transfer Size
main.b3b8c7722b19cd99.js      | main                                         |   4.08 MB |               641.01 kB
styles.5c3bcd85584b8126.css   | styles                                       |   1.18 MB |                70.90 kB
scripts.88eb76880d7b3aeb.js   | scripts                                      | 576.22 kB |               127.54 kB
polyfills.04f204b439cf5539.js | polyfills                                    |  64.01 kB |                20.49 kB
runtime.03ac26c9e9215665.js   | runtime                                      |   3.43 kB |                 1.62 kB

                              | Initial Total                                |   5.88 MB |               861.57 kB

Lazy Chunk Files              | Names                                        |  Raw Size | Estimated Transfer Size
990.3441a89787cb2b22.js       | reportes-reportes-module                     | 843.36 kB |               169.88 kB
498.fa894353a855f3ea.js       | planes-by-clientes-planes-by-clientes-module |  43.75 kB |                 7.95 kB
965.6e2d43eaa4d662bd.js       | user-user-module                             |  13.15 kB |                 2.99 kB
833.f6030dab9ba3388c.js       | profile-profile-module                       |  10.96 kB |                 2.50 kB
274.b81178aa65be5a26.js       | auth-request-reset-module                    |   4.11 kB |                 1.38 kB
701.3ab8d75cfaa4005f.js       | auth-reset-password-module                   |   2.74 kB |                 1.11 kB
6.fb934c415c22581d.js         | auth-reset-password-error-module             |   1.71 kB |               783 bytes
common.2dde79ea0e26dbae.js    | common                                       |   1.63 kB |               694 bytes

Build at: 2023-06-22T12:10:12.503Z - Hash: 4ae9f6ec4fa26815 - Time: 67089ms

Warning: G:\Trabajo\Ingenius\Proyecto\eFigma\develop-branch\efigma-front-angular\node_modules\ng2-pdf-viewer\fesm2015\ng2-pdf-viewer.mjs depends on 'pdfjs-dist/build/pdf'. CommonJS or AMD dependencies can cause optimization bailouts.
For more info see: https://angular.io/guide/build#configuring-commonjs-dependencies

Warning: G:\Trabajo\Ingenius\Proyecto\eFigma\develop-branch\efigma-front-angular\node_modules\ng2-pdf-viewer\fesm2015\ng2-pdf-viewer.mjs depends on 'pdfjs-dist/web/pdf_viewer'. CommonJS or AMD dependencies can cause optimization bailouts.
For more info see: https://angular.io/guide/build#configuring-commonjs-dependencies

Warning: G:\Trabajo\Ingenius\Proyecto\eFigma\develop-branch\efigma-front-angular\src\app\assigners\components\listado\listado.component.ts depends on 'lorem-ipsum'. CommonJS or AMD dependencies can cause optimization bailouts.
For more info see: https://angular.io/guide/build#configuring-commonjs-dependencies

Warning: G:\Trabajo\Ingenius\Proyecto\eFigma\develop-branch\efigma-front-angular\src\app\plan\components\listado\listado.component.ts depends on 'xml2js'. CommonJS or AMD dependencies can cause optimization bailouts.
For more info see: https://angular.io/guide/build#configuring-commonjs-dependencies
```

3- Nos dirigimos a la carpeta 'dist' y copiamos el contenido de la misma, - debe aparecer una carpeta nombrada 'eFirma-front' - en el home (de tu usuario) del servidor 'efirma.softel.cu', se puede copiar tambien en cualquier otro directorio. Para realizar esta copia, puede utilizar el uso del comando scp

```sh
PS C:\Users\potlitel> scp
usage: scp [-346BCpqrTv] [-c cipher] [-F ssh_config] [-i identity_file]
            [-J destination] [-l limit] [-o ssh_option] [-P port]
            [-S program] source ... target
PS C:\Users\potlitel>
```

pero recomendamos hacer uso de algún utilitario con interfaz visual (como el WinSCP) para verificar visualmente el estado de la copia, en ocasiones la red se comporta de modo bastante complejo y puede tardar un poco en completar el proceso de copiado de archivos.

4- Iniciamos sesión, vía ssh (recomendamos utilizar MobaXterm) y verificamos previamente que el sitio tenga todos los ficheros previos a esta publicación, para esto ejecutamos el siguiente comando:

```sh
ls -l /var/www/html
```

debemos obtener una salida similar a la siguiente:

```sh
root@efirma:/home/alain# ls -l /var/www/html
total 9132
-rwxrwxrwx 1 root root    4211 jun 26 10:44 274.b81178aa65be5a26.js
-rwxrwxrwx 1 root root   75408 jun 26 10:44 3rdpartylicenses.txt
-rwxrwxrwx 1 root root   42739 jun 26 10:44 498.c9b45a986ed79daa.js
-rwxrwxrwx 1 root root    1749 jun 26 10:44 6.fb934c415c22581d.js
-rwxrwxrwx 1 root root    2804 jun 26 10:44 701.3ab8d75cfaa4005f.js
-rwxrwxrwx 1 root root   11226 jun 26 10:44 833.df66e082cdc3e87f.js
-rwxrwxrwx 1 root root   13467 jun 26 10:44 965.792652d80ccbae85.js
-rwxrwxrwx 1 root root  863597 jun 26 10:44 990.a8e32591ef60a155.js
drwxrwxrwx 8 root root    4096 jun 26 10:44 assets
-rwxrwxrwx 1 root root  137124 jun 26 10:44 bootstrap-icons.51e2826a5e883791.woff
-rwxrwxrwx 1 root root  102536 jun 26 10:44 bootstrap-icons.988b20fa812f3498.woff2
-rwxrwxrwx 1 root root    1666 jun 26 10:44 common.2dde79ea0e26dbae.js
-rwxrwxrwx 1 root root     948 jun 26 10:44 favicon.ico
-rwxrwxrwx 1 root root    9869 jun 26 10:44 index.html
-rwxrwxrwx 1 root root 4263029 jun 26 10:44 main.3cfe4b5b66a831d8.js
-rwxrwxrwx 1 root root  164912 jun 26 10:44 material-icons.4ad034d2c499d9b6.woff
-rwxrwxrwx 1 root root  128352 jun 26 10:44 material-icons.59322316b3fd6063.woff2
-rwxrwxrwx 1 root root  182028 jun 26 10:44 material-icons-outlined.78a93b2079680a08.woff
-rwxrwxrwx 1 root root  155276 jun 26 10:44 material-icons-outlined.f86cb7b0aa53f0fe.woff2
-rwxrwxrwx 1 root root  206260 jun 26 10:44 material-icons-round.92dc7ca2f4c591e7.woff
-rwxrwxrwx 1 root root  173620 jun 26 10:44 material-icons-round.b10ec9db5b7fbc74.woff2
-rwxrwxrwx 1 root root  135984 jun 26 10:44 material-icons-sharp.3885863ee4746422.woff2
-rwxrwxrwx 1 root root  156236 jun 26 10:44 material-icons-sharp.a71cb2bf66c604de.woff
-rwxrwxrwx 1 root root  339600 jun 26 10:44 material-icons-two-tone.588d63134de807a7.woff
-rwxrwxrwx 1 root root  215704 jun 26 10:44 material-icons-two-tone.675bd578bd14533e.woff2
-rwxrwxrwx 1 root root   65551 jun 26 10:44 polyfills.04f204b439cf5539.js
-rwxrwxrwx 1 root root    3513 jun 26 10:44 runtime.66c1d6bcf65f0f1e.js
-rwxrwxrwx 1 root root  590054 jun 26 10:44 scripts.88eb76880d7b3aeb.js
-rwxrwxrwx 1 root root 1234482 jun 26 10:44 styles.5c3bcd85584b8126.css
```

5- Eliminamos con el siguiente comando todos los ficheros de este directorio

```sh
rm -r /var/www/html/*
```

6- Copiamos el contenido de la carpeta que contiene el nuevo 'build' a publicar

```sh
cp -r eFirma-front/* /var/www/html/
```

7- Nos posicionamos en el directorio donde acabamos de copiar el nuevo 'build' (/var/www/html/)

```sh
cd /var/www/html/
```

8- Y para finalizar, ejecutamos el siguiente comando para otorgar los permisos necesarios

```sh
chmod -R 777 *
```

Listo, tenemos publicada con estos pasos, una nueva versión del backoffice de eFirma!!!

## My specifications
https://localhost:8074/RemoteDigitalSignatureRestApi/swagger-ui/index.html#/
https://localhost:8074/RemoteDigitalSignatureRestApi/authenticate
{
  "username": "admin",
  "password": "zaqWE*123"
}

D:\IngeniusProyecto\remote-digital-signature-rest-api\src\main\resources\digital-signature-rest-api.properties

/assignPermissionToApiClient
-----------------------------------------------------------------------
https://apexcharts.com/
https://www.npmjs.com/package/ng-multiselect-dropdown
https://stackblitz.com/edit/ng-multiselect-dropdown?file=src%2Fapp%2Fapp.component.ts
MAVEN_HOME
%MAVEN_HOME%\bin
ng build --configuration production --aot=false  --build-optimizer=false
https://gitlab.com/bernardo.romero/efigma-front-angular/-/tree/develop
efirma.softel.cu
https://gitlab.com/bernardo.romero/efigma-front-angular/-/tree/develop
alain/ zaqWE*123
https://localhost:8074/RemoteDigitalSignatureRestApi/swagger-ui/index.html#/

-----------------------------------------------
alain@efirma:~$ sudo rm -r /var/www/html/*
alain@efirma:~$ sudo cp -r eFirma-front/* /var/www/html/
alain@efirma:~$ sudo chmod -R 777 *

-----------------------------------------
user: edu123
password: 1234567 
