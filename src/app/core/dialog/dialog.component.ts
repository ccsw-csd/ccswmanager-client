import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title: string, description: string}
  ) { }

  ngOnInit(): void {
    
  }

  yes(): void {
    this.dialogRef.close(true);
  }

  no() : void {
    this.dialogRef.close(false);
  }

}
