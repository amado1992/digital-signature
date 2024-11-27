import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexNoData,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexXAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Cliente } from 'src/app/clientes/interfaces/clientes.interface';
import { ClientesService } from 'src/app/clientes/services/clientes.service';
import { PlanService } from 'src/app/plan/services/plan.service';
import { handlerResponseError } from 'src/app/utils/common-configs';
import { DashboardService } from '../../services/dashboard.service';
import { Plan } from '../../../plan/interfaces/plan';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  noData: ApexNoData;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  locales: 'es';
};

export type seriesGraph = {
  name: string;
  data: number[];
};

export type ChartOptionsInstitutional = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  noData: ApexNoData;
  responsive: ApexResponsive[];
  labels: any;
  stroke: ApexStroke;
  fill: ApexFill;
  legend: ApexLegend;
};

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, AfterViewInit {
  users!: any | null;
  public usuarios$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public clientes$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public clientesAPI$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public planes$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  cAnimated: boolean = false;
  dAnimated: boolean = false;
  //Se declara como tipo any, para evitar el siguiente error 'Type 'boolean' cannot be used as an index type.ts(2538)', pendiente a mejora!!
  ClientesList!: any[];
  graph_data!: any[];
  apexdataseries!: { x: string; y: number }[];

  // Accessing DOM elements with ViewChild
  @ViewChild('clientesApi') clientesApi: any;
  @ViewChild('clientes') clientes: any;
  @ViewChild('Usuarios') usuarios: any;
  @ViewChild('Planes') planes: any;
  @ViewChild('chart') chart!: ChartComponent;
  //https://stackoverflow.com/questions/66886287/type-undefined-is-not-assignable-to-type-apexaxischartseries-apexnonaxischa
  public chartOptions: Partial<ChartOptions> | any = {} as ChartOptions;
  public chartOptionsClientesInstitutional:
    | Partial<ChartOptionsInstitutional>
    | any = {} as ChartOptionsInstitutional;
  // public chartOptionsPlanes!: Partial<ChartOptions> | any;

  // ngAfterViewInit is called after the view is initially rendered. @ViewChild() depends on it.
  // You can't access view members before they are rendered.
  ngAfterViewInit() {
    this.service.getTotalUsuarios();
    this.service.getTotalClientes();
    this.service.getTotalClientesAPI();
    this.service.getTotalPlanes();
    this.service.itemsUsuarios.subscribe((users) => {
      this.usuarios$.next(users);
      this.animateValue(this.usuarios, 0, this.usuarios$.value, 3000);
    });
    this.service.itemsClientes.subscribe((clients) => {
      this.clientes$.next(clients);
      this.animateValue(this.clientes, 0, this.clientes$.value, 3000);
    });
    // this.service.itemsClientesAPI.subscribe((clients) => {
    //   this.clientesAPI$.next(clients);
    //   this.animateValue(
    //     this.clientesApi,
    //     0,
    //     this.clientesAPI$.value.length,
    //     3000
    //   );
    // });
    this.service.itemsPlanes.subscribe((plans) => {
      this.planes$.next(plans);
      this.animateValue(this.planes, 0, this.planes$.value.length, 3000);
    });
  }

  // Counter animation fucntion
  animateValue(obj: any, start: any, end: any, duration: any) {
    let startTimestamp: any = null;
    const step = (timestamp: any) => {
      //  Set the actual time
      if (!startTimestamp) startTimestamp = timestamp;
      // Calculate progress (the time versus the set duration)
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Calculate the value compared to the progress and set the value in the HTML
      if (obj != undefined) {
      obj.nativeElement.innerHTML = Math.floor(
        progress * (end - start) + start
      );
    }
      // If progress is not 100%, an call a new animation of step
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    // Call a last animation of step
    window.requestAnimationFrame(step);
  }

  /**
   * Description: Constructor de la clase
   * @param {Router} privaterouter
   *  */
  constructor(
    private router: Router,
    private render: Renderer2,
    private authService: AuthService,
    private service: DashboardService,
    private clienteService: ClientesService,
    readonly planService: PlanService
  ) {
    this.TiposClientesGraph();
    this.ClientesPorPlanesGraph();
  }

  /**
   * Description: Function para mostrar relación Clientes por Planes en un gráfico
   * Refs: //https://stackoverflow.com/questions/74879957/custom-apexchart
   * Refs: //https://stackoverflow.com/questions/69966783/im-trying-to-fill-an-apex-chart-with-real-time-data-but-it-never-fills
   * Refs: //https://stackoverflow.com/questions/60909015/apex-charts-setting-series-data-from-array-in-state
   * @returns {any}
   *  */
  private ClientesPorPlanesGraph(): void {
    this.planService.fetchListObsevable().subscribe((resp: Plan[]) => {
      this.graph_data = resp;
      if (this.graph_data.length > 0) {
        //Adding color property to dataset
        let g_data: { x: string; y: number }[] = [];
        this.graph_data.forEach((data: Plan, index) => {
          // let test = this.statusService.getFilteredSeries(obj.label)
          let obj = {
            x: data.nombre,
            y: data.clients != undefined ? data.clients.length : 0,
          };
          g_data.push(obj);
          this.apexdataseries = g_data;
          console.log(g_data);
          var es = require('apexcharts/dist/locales/es.json');
          //Inicializamos las opciones del gráfico con datos de respuesta desde el endpoint correspondiente
          this.setDinamicOptions(
            this.apexdataseries,
            'Clientes asociados',
            'Clientes por Planes',
            es
          );
        });
      } else {
        var es = require('apexcharts/dist/locales/es.json');
        //Inicializamos las opciones del gráfico sin datos de respuesta
        this.setDinamicOptions(
          this.apexdataseries,
          'Clientes asociados',
          'Clientes por Planes',
          es
        );
      }
    });
  }

  /**
   * Description: Function para setear de modo dinámico, configuraciones de los gráficos de tipo "Barra"
   * @param {any} seriesCustom:{x:string;y:number}[]
   * @param {string} seriesName
   * @returns {any}
   *  */
  public setDinamicOptions(
    seriesCustom: { x: string; y: number }[],
    seriesName: string,
    title: string,
    es: string
  ): void {
    this.chartOptions = {
      series: [
        {
          name: seriesName,
          data: seriesCustom,
        },
      ],
      chart: {
        type: 'bar',
        locales: [es],
        defaultLocale: 'es',
        height: 400,
        toolbar: {
          show: true,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            customIcons: [],
          },
          export: {
            csv: {
              filename: 'Relación_Clientes_Planes',
              columnDelimiter: ',',
              headerCategory: 'Clientes por Planes',
              headerValue: 'Total',
              dateFormatter(timestamp: any) {
                return new Date(timestamp).toDateString();
              },
            },
            svg: {
              filename: 'Relación_Clientes_Planes',
            },
            png: {
              filename: 'Relación_Clientes_Planes',
            },
          },
          autoSelected: 'zoom',
        },
      },
      fill: {
        colors: ['#1d77ff', '#7c5efd', '#07cbe8'],

        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'vertical',
          shadeIntensity: 0,
          gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
          inverseColors: true,
          opacityFrom: 0.7,
          opacityTo: 0.23,
          stops: [0, 40, 100],
        },
      },
      stroke: {
        show: true,
        curve: 'smooth',
        colors: ['#1d77ff', '#7c5efd', '#07cbe8'],
        width: 1,
        dashArray: 0,
      },
      xaxis: {
        type: 'category',
        labels: {
          show: true,
          // formatter: function (val: any) {
          //   return val + 'K';
          // },
        },
      },
      yaxis: {
        type: 'numeric',
        labels: {
          show: true,
          // formatter: function (val: any) {
          //   return val + 'K';
          // },
        },
      },
      plotOptions: {
        bar: {
          barHeight: '100%',
          // distributed: true,
          borderRadius: 10,
          colors: {
            backgroundBarOpacity: 0.5,
            backgroundBarRadius: 8,
          },
        },
      },
      title: {
        text: title,
        align: 'left',
        offsetX: 110,
      },
      dataLabels: {
        enabled: false,
        offsetX: -6,
        style: {
          fontSize: '14px',
          colors: ['#F44336', '#E91E63', '#9C27B0'],
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: true,
          format: 'HH:mm',
        },
        y: {
          formatter: function (val: any) {
            return val;
          },
          title: {
            formatter: function (seriesName: any) {
              return 'Clientes asociados: ';
            },
          },
        },
      },
      annotations: {
        position: 'front',
        yaxis: [
          {
            y: 3,
            // y2: null,
            borderColor: 'red',
            fillColor: 'red',
            strokeDashArray: 0,
            label: {
              borderColor: 'transparent',
              style: {
                color: 'black',
                background: 'transparent',
              },
              text: 'No existen datos para mostrar',
              textAnchor: 'start',
              position: 'center',
            },
          },
        ],
      },
      noData: {
        text: 'No-Data',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          fontSize: '14px',
        },
      },
    };
  }

  public setOptions(
    series: {
      // nombrePlan: string;
      totalClientes: number;
    }[]
  ) {
    // this.chartOptionsPlanes = {
    //   // series: [
    //   //   {
    //   //     name: 'Some-series',
    //   //     data: this.apexdataseries,
    //   //   },
    //   // ],
    //   // chart: {
    //   //   type: 'bar',
    //   //   height: 400,
    //   //   toolbar: {
    //   //     show: false,
    //   //   },
    //   // },
    //   // fill: {
    //   //   colors: ['#1d77ff', '#7c5efd'],
    //   //   type: 'gradient',
    //   //   gradient: {
    //   //     shade: 'dark',
    //   //     type: 'vertical',
    //   //     shadeIntensity: 0,
    //   //     gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
    //   //     inverseColors: true,
    //   //     opacityFrom: 0.7,
    //   //     opacityTo: 0.23,
    //   //     stops: [0, 40, 100],
    //   //   },
    //   // },
    //   // stroke: {
    //   //   show: true,
    //   //   curve: 'smooth',
    //   //   colors: ['#1d77ff', '#7c5efd'],
    //   //   width: 1,
    //   //   dashArray: 0,
    //   // },
    //   // xaxis: {
    //   //   type: 'category',
    //   //   labels: {
    //   //     show: true,
    //   //   },
    //   // },
    //   // plotOptions: {
    //   //   bar: {
    //   //     barHeight: '100%',
    //   //     borderRadius: 2,
    //   //     colors: {
    //   //       backgroundBarOpacity: 0.5,
    //   //       backgroundBarRadius: 8,
    //   //     },
    //   //   },
    //   // },
    //   // title: {
    //   //   text: 'Placeholder chart',
    //   // },
    //   // dataLabels: {
    //   //   enabled: false,
    //   //   offsetX: -6,
    //   //   style: {
    //   //     fontSize: '12px',
    //   //     colors: ['#F44336', '#E91E63', '#9C27B0'],
    //   //   },
    //   // },
    //   // series: this.getAllSeries(),
    //   series: [
    //     {
    //       name: 'Some-series',
    //       data: series,
    //     },
    //   ],
    //   chart: {
    //     type: 'bar',
    //     height: 350,
    //     stacked: true,
    //   },
    //   dataLabels: {
    //     enabled: false,
    //   },
    //   xaxis: {
    //     categories: [
    //       '0-100',
    //       '101-200',
    //       '201-300',
    //       '301-400',
    //       '401-500',
    //       '501-600',
    //       '601-700',
    //     ],
    //     title: {
    //       text: 'Number of pages',
    //     },
    //   },
    //   yaxis: {
    //     title: {
    //       text: 'Number of books',
    //     },
    //   },
    //   legend: {
    //     show: false,
    //   },
    //   colors: ['#269ffb'],
    //   stroke: {
    //     colors: ['#ffffff'],
    //     width: 1,
    //   },
    // };
  }

  /**
   * Description: Function para mostrar relación Tipo de Clientes en un gráfico
   * @returns {any}
   *  */
  private TiposClientesGraph(): void {
    //Nos subscribimos al método para obtener el total de Clientes API
    this.service.itemsClientesAPI.subscribe((clients) => {
      this.clientesAPI$.next(clients);
      //Una vez subscrito y que obtengamos el total de clientes API, nos subscribimos entonces al método que
      //obtiene el listado de clientes, ya entonces tenemos todos los datos para mostrar en el gráfico:
      //'Clientes Jurídicos', 'Clientes Naturales' y 'Clientes API'.
      this.clienteService.getListadoClientes().subscribe(
        (resp) => {
          this.ClientesList = resp;
          //https://stackoverflow.com/questions/70984120/sum-and-grouping-json-data-using-javascript
          const resultArr = [];
          //Primeramente iteramos por todo el array, para solamente quedarnos con las properties 'id' e 'institutional' y, muy importante, la property
          //'id' la seteamos con valor 1, para everybody, de este modo la sumatoria final nos dará un resultado real y aplicables a gráfico que deseamos
          //construir
          this.ClientesList = this.ClientesList.map((item) => ({
            id: 1,
            institutional: item.institutional,
          }));
          // grouping by location and resulting with an object using Array.reduce() method
          const groupByInstitutional = this.ClientesList.reduce(
            (group, item) => {
              const { institutional } = item;
              group[institutional] = group[institutional] ?? [];
              group[institutional].push(item.id);
              return group;
            },
            {}
          );
          // Finally calculating the sum based on the location array we have.
          Object.keys(groupByInstitutional).forEach((item) => {
            groupByInstitutional[item] = groupByInstitutional[item].reduce(
              (a: any, b: any) => a + b
            );
            resultArr.push({
              location: item,
              transaction: groupByInstitutional[item],
            });
          });
          var es = require('apexcharts/dist/locales/es.json');
          //Inicializamos las opciones del gráfico con datos de respuesta desde el endpoint correspondiente
          this.setUpConfigsTiposClientesGrahp(groupByInstitutional, es);
        },
        (err: HttpErrorResponse) => {
          handlerResponseError(err);
        }
      );
      //Invocamos a la function para "animar" el total de Clientes API en su 'card' correspondiente.
      this.animateValue(
        this.clientesApi,
        0,
        this.clientesAPI$.value.length,
        3000
      );
    });
  }

  /**
   * Description: Function para setear las configuraciones del gráfico de "Relación Tipos de Clientes".
   * @param {any} groupByInstitutional: Array agrupado por property "Institutional"
   * @param {any} es: Locale a utilizar en el gráfico, en esta caso 'es'
   * @returns {any}
   *  */
  private setUpConfigsTiposClientesGrahp(
    groupByInstitutional: any,
    es: string
  ) {
    this.chartOptionsClientesInstitutional = {
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                color: '#373d3f',
                formatter: function (w: any) {
                  return w.globals.seriesTotals.reduce((a: any, b: any) => {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },
      series: [
        groupByInstitutional.true,
        groupByInstitutional.false,
        this.clientesAPI$.value.length,
      ],
      title: {
        text: 'Relación de tipos de clientes',
        align: 'left',
        offsetX: 110,
      },
      chart: {
        // type: 'polarArea',
        type: 'donut',
        animations: {
          enabled: true,
        },
        locales: [es],
        defaultLocale: 'es',
        toolbar: {
          show: true,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            customIcons: [],
          },
          export: {
            csv: {
              filename: 'Relación_tipos_clientes',
              columnDelimiter: ',',
              headerCategory: 'Tipo de cliente',
              headerValue: 'Total',
              dateFormatter(timestamp: any) {
                return new Date(timestamp).toDateString();
              },
            },
            svg: {
              filename: 'Relación_tipos_clientes',
            },
            png: {
              filename: 'Relación_tipos_clientes',
            },
          },
          autoSelected: 'zoom',
        },
        zoom: {
          enabled: true,
          type: 'x',
          autoScaleYaxis: false,
          zoomedArea: {
            fill: {
              color: '#90CAF9',
              opacity: 0.4,
            },
            stroke: {
              color: '#0D47A1',
              opacity: 0.4,
              width: 1,
            },
          },
        },
      },
      labels: [`Clientes Jurídicos`, `Clientes Naturales`, `Clientes API`],
      stroke: {
        colors: ['#fff'],
      },
      fill: {
        opacity: 0.8,
      },
      dataLabels: {
        enabled: true,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      legend: {
        fontSize: '12px',
        fontFamily: 'Helvetica, Arial',
        // fontWeight: 200,
        // itemMargin: {
        //   vertical: 5,
        //   horizontal: 15,
        // },
        formatter: function (seriesName: any, opts: any) {
          return (
            // '<div class="legend-info">' +
            // '<span>' +
            seriesName +
            ':' +
            // '</span>' +
            // '<span>' +
            opts.w.globals.series[opts.seriesIndex]
            // '</span>' +
            // '</div>'
          );
        },
      },
      annotations: {
        position: 'front',
        yaxis: [
          {
            y: 3,
            // y2: null,
            borderColor: 'red',
            fillColor: 'red',
            strokeDashArray: 0,
            label: {
              borderColor: 'transparent',
              style: {
                color: 'black',
                background: 'transparent',
              },
              text: 'No existen datos para mostrar',
              textAnchor: 'start',
              position: 'center',
            },
          },
        ],
      },
      noData: {
        text: 'No existen datos para mostrar',
        align: 'center',
        verticalAlign: 'middle',
      },
    };
  }

  /**
   * Description: Funcion para verificar si el usuario que accede a la sección está autenticado.
   * @returns {any}
   *  */
  private isAuthenticatedUser() {
    this.authService.getIsLogged().pipe(
      tap((res) => {
        if (!res) {
          this.router.navigate(['/login']);
          return;
        }
      })
    );
  }

  /**
   * Description: ngOnIniEvent
   * @returns {any}
   *  */
  ngOnInit(): void {
    this.isAuthenticatedUser();
    // this.service.getTotalUsuarios();
    // this.service.itemsUsuarios.subscribe((users) => this.usuarios$.next(users));
    // console.log(this.usuarios$.value);
    // this.service.itemsUsuarios
    //   .pipe((users) => (this.users = users))
    //   .subscribe();
    // this.service.getTotalUsuarios().subscribe((resp) => {
    //   console.log('Total de usuarios: ' + resp);
    // });
    // this.animateValue(this.clientesApi, 0, 75, 3000);
    // this.animateValue(this.clientes, 0, 215, 3000);
    // this.animateValue(this.usuarios, 0, this.users, 3000);
  }

  /**
   * Description: Navega hacia la ruta suministrada como parámetro
   * @param {string} path
   * @returns {any}
   *  */
  NavigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
