import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TechnologyService } from 'src/app/core/services/technology.service';
import { TechnologyDto } from 'src/app/core/to/TechnologyDto';

@Component({
  selector: 'app-technology-edit',
  templateUrl: './technology-edit.component.html',
  styleUrls: ['./technology-edit.component.scss']
})
export class TechnologyEditComponent implements OnInit {

  title: string = 'Nueva Tecnología';  
  itemData : TechnologyDto = new TechnologyDto();

  constructor(
    public dialogRef: MatDialogRef<TechnologyEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private technologyService: TechnologyService,
  ) { 

    if (data) {
      this.itemData.id = data.id;
      this.itemData.name = data.name;

      if (data.id) this.title = 'Edición de Tecnología';
    }
  }

  ngOnInit(): void {
  }


  save(): void {

    this.technologyService.save(this.itemData).subscribe(() => {
      this.dialogRef.close(true);
    })
  }

  close(): void {
    this.dialogRef.close(false);
  }

}
