//According to 'https://stackblitz.com/edit/angular-reusable-table?file=src%2Fapp%2Fcomponents%2Ftable%2Fcolumn.ts'
export interface Column {
  columnDef: string;
  header: string;
  cell: Function;
  isLink?: boolean;
  url?: string;
}

//According to  https://github.com/dnlrbz/material-reusable-table/blob/master/src/app/table/table.component.ts
export interface TableColumn {
  name: string;
  dataKey: string;
  objectDataKey?: string;
  position?: 'right' | 'left' | 'center';
  isSortable?: boolean;
  isPipeable?: boolean;
  isBooleable?: boolean;
  isYesNoBooleable?: boolean;
  isLink?: boolean;
  url?: string;
  isDate?: boolean;
}
