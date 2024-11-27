import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { esRangeLabel } from 'src/app/utils/common-configs';
import { Column, TableColumn } from './mat-reusable-table.interface';

@Component({
  selector: 'app-mat-reusable-table',
  templateUrl: './mat-reusable-table.component.html',
  styleUrls: ['./mat-reusable-table.component.scss'],
})
export class MatReusableTableComponent implements OnInit, AfterViewInit {
  public tableDataSource = new MatTableDataSource<any>([]);
  public displayedColumns!: string[];
  @ViewChild(MatPaginator, { static: false }) matPaginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) matSort!: MatSort;

  @Input() isPageable = false;
  @Input() isSortable = false;
  @Input() isFilterable = false;
  @Input() tableColumns: TableColumn[] = [];

  @Input() rowActionIcon!: string;
  @Input() BasicIcon!: boolean;
  @Input() BasicPlanIcon!: boolean;
  @Input() CertificadosIcon!: boolean;
  @Input() CuentasBancariasIcon!: boolean;
  @Input() PermisosIcon!: boolean;
  @Input() RolesAsignadosIcon!: string;
  @Input() AsociarIcon!: boolean;
  @Input() UsuariosIcon!: boolean;

  @Input() paginationSizes: number[] = [5, 10, 15];
  @Input() defaultPageSize = this.paginationSizes[1];

  @Input() AsignPermisosIcon!: boolean;

  @Output() sort: EventEmitter<Sort> = new EventEmitter();
  @Output() rowAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() editAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() certificadosAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() cuentasBancariasAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() permisosAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() rolesAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() asociarAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() usuariosAsociadosAction: EventEmitter<any> =
    new EventEmitter<any>();
  @Output() detallesPlanAction: EventEmitter<any> = new EventEmitter<any>();

  @Output() permisosAsignAction: EventEmitter<any> = new EventEmitter<any>();

  term: string = '';
  numDate = 1478496544151;

  // this property needs to have a setter, to dynamically get changes from parent component
  @Input() set tableData(data: any[]) {
    this.setTableDataSource(data);
  }

  @Input() set filter(data: string) {
    this.term = data;
    this.applyFilterTerm(data);
  }

  @Input() firstPageLabel!: string | undefined;
  @Input() itemsPerPageLabel!: string | undefined;
  @Input() lastPageLabel!: string | undefined;
  @Input() nextPageLabel!: string | undefined;
  @Input() previousPageLabel!: string | undefined;

  constructor(public _MatPaginatorIntl: MatPaginatorIntl) {}

  /**
   * Description:Function ngAfterViewInit
   * We need this, in order to make pagination work with *ngIf
   * @returns {any}
   *  */
  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.matPaginator;
  }

  /**
   * Description: Function ngOnInit
   * @returns {any}
   *  */
  ngOnInit(): void {
    this.matPaginatorIntlInit();
    const columnNames = this.tableColumns.map(
      (tableColumn: TableColumn) => tableColumn.name
    );
    if (this.rowActionIcon) {
      this.displayedColumns = [this.rowActionIcon, ...columnNames];
    } else {
      this.displayedColumns = columnNames;
    }
  }

  /**
   * Description: Function matPaginatorIntlInit
   * @returns {any}
   *  */
  private matPaginatorIntlInit(): void {
    this._MatPaginatorIntl.firstPageLabel =
      this.firstPageLabel ?? 'Primera página';
    this._MatPaginatorIntl.itemsPerPageLabel =
      this.itemsPerPageLabel ?? 'Items por página:';
    this._MatPaginatorIntl.lastPageLabel =
      this.lastPageLabel ?? 'Ultima página';
    this._MatPaginatorIntl.nextPageLabel =
      this.nextPageLabel ?? 'Página siguiente';
    this._MatPaginatorIntl.previousPageLabel =
      this.previousPageLabel ?? 'Página anterior';
    this._MatPaginatorIntl.getRangeLabel = esRangeLabel;
  }

  /**
   * Description: Function setTableDataSource
   * @param {any} data
   * @returns {any}
   *  */
  setTableDataSource(data: any) {
    this.tableDataSource = new MatTableDataSource<any>(data);
    this.tableDataSource.paginator = this.matPaginator;
    this.tableDataSource.sort = this.matSort;
  }

  /**
   * Description: Functoin applyFilter
   * @param {Event} event
   * @returns {any}
   *  */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Description: Function applyFilterTerm
   * @param {String} term
   * @returns {any}
   *  */
  applyFilterTerm(term: String) {
    console.log(`Filter from parent component: ${term}`);
    this.tableDataSource.filter = term.trim().toLowerCase();
  }

  /**
   * Description: Function sortTable
   * @param {Sort} sortParameters
   * @returns {any}
   *  */
  sortTable(sortParameters: Sort) {
    // defining name of data property, to sort by, instead of column name
    sortParameters.active = this.tableColumns.find(
      (column) => column.name === sortParameters.active
    )!.dataKey;
    this.sort.emit(sortParameters);
  }

  /**
   * Description: Function emitRowAction
   * @param {any} row
   * @returns {any}
   *  */
  emitRowAction(row: any) {
    this.rowAction.emit(row);
  }

  /**
   * Description: Function emitEditAction
   * @param {any} row
   * @returns {any}
   *  */
  emitEditAction(row: any) {
    this.editAction.emit(row);
  }

  /**
   * Description: Function emitDeleteAction
   * @param {any} row
   * @returns {any}
   *  */
  emitDeleteAction(row: any) {
    this.deleteAction.emit(row);
  }

  /**
   * Description: Function emitCertificadosAction
   * @param {any} row
   * @returns {any}
   *  */
  emitCertificadosAction(row: any) {
    this.certificadosAction.emit(row);
  }

  /**
   * Description: Function emitCuentasBancariasAction
   * @param {any} row
   * @returns {any}
   *  */
  emitCuentasBancariasAction(row: any) {
    this.cuentasBancariasAction.emit(row);
  }

  /**
   * Description: Function emitPermisosAction
   * @param {any} row
   * @returns {any}
   *  */
  emitPermisosAction(row: any) {
    this.permisosAction.emit(row);
  }

  emitPermisosAsignAction(row: any) {
    this.permisosAsignAction.emit(row);
  }

  /**
   * Description: Function emitRolesAction
   * @param {any} row
   * @returns {any}
   *  */
  emitRolesAction(row: any) {
    this.rolesAction.emit(row);
  }

  /**
   * Description: Function emitAsociarAction
   * @param {any} row
   * @returns {any}
   *  */
  emitAsociarAction(row: any) {
    this.asociarAction.emit(row);
  }

  /**
   * Description: Function emitUsuariosAction
   * @param {any} row
   * @returns {any}
   *  */
  emitUsuariosAction(row: any) {
    this.usuariosAsociadosAction.emit(row);
  }

  /**
   * Description: Function emitDetallesPlanAction
   * @param {any} row
   * @returns {any}
   *  */
  emitDetallesPlanAction(row: any) {
    this.detallesPlanAction.emit(row);
  }

  isNumber(val: any): boolean {
    return typeof val === 'number';
  }

  typeOf(value: any) {
    return typeof value;
  }
}
