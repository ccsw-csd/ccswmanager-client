import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackConstants } from '../constants/snack-constants';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar,) { }


  public error(text: string) : void {
    this.snackBar.open(text, 'Error', {
      duration: 5000,
      panelClass: ['snackbar-red'],
    });
  }

  showMessage(message: string) {
    this.snackBar.open(message, SnackConstants.OK, {
      duration: 5000
    });
  }
}
