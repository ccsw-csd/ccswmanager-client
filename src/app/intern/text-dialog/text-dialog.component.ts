import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-text-dialog',
  templateUrl: './text-dialog.component.html',
  styleUrls: ['./text-dialog.component.scss']
})
export class TextDialogComponent implements OnInit {

  edit: boolean;
  text: string;

  constructor(
    public dialogRef: MatDialogRef<TextDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title: string, text: string, edit: boolean}
  ) { 
    this.edit = data.edit;
    this.text = data.text;
  }

  ngOnInit(): void {
    
  }

  save(): void {
    this.dialogRef.close(this.text);
  }

  cancel() : void {
    this.dialogRef.close();
  }

}
