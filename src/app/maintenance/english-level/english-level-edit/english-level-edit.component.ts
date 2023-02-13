import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LevelService } from 'src/app/core/services/english-level.service';
import { LevelDto } from 'src/app/core/to/LevelDto';

@Component({
  selector: 'app-english-level-edit',
  templateUrl: './english-level-edit.component.html',
  styleUrls: ['./english-level-edit.component.scss']
})
export class EnglishLevelEditComponent implements OnInit {

  title: string = 'Nuevo Nivel de Inglés';  
  itemData : LevelDto = new LevelDto();

  constructor(
    public dialogRef: MatDialogRef<EnglishLevelEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private levelService: LevelService,
  ) {
    if (data) {
      this.itemData.id = data.id;
      this.itemData.name = data.name;

      if (data.id) this.title = 'Edición de Nivel de Inglés';
    }
  }

  ngOnInit(): void {
  }

  save(): void {

    this.levelService.save(this.itemData).subscribe(() => {
      this.dialogRef.close(true);
    })
  }

  close(): void {
    this.dialogRef.close(false);
  }

}
