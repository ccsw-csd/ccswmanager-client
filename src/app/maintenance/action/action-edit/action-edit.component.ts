import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActionService } from 'src/app/core/services/action.service';
import { ActionDto } from 'src/app/core/to/ActionDto';

@Component({
  selector: 'app-action-edit',
  templateUrl: './action-edit.component.html',
  styleUrls: ['./action-edit.component.scss']
})
export class ActionEditComponent implements OnInit {

  title: string = 'Nueva Acción';  
  itemData : ActionDto = new ActionDto();

  constructor(
    public dialogRef: MatDialogRef<ActionEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private actionService: ActionService,
  ) {
    if (data) {
      this.itemData.id = data.id;
      this.itemData.name = data.name;

      if (data.id) this.title = 'Edición de Acción';
    }
  }

  ngOnInit(): void {
  }

  save(): void {

    this.actionService.save(this.itemData).subscribe(() => {
      this.dialogRef.close(true);
    })
  }

  close(): void {
    this.dialogRef.close(false);
  }


}
