export interface DialogData {
  type : DialogTypes;
  header: string;
  body: string | string[];
  acceptButton?: string;
  cancelButton?: string;
}

export type DialogTypes = 'error' | 'alert' | 'success' | 'dialog';
