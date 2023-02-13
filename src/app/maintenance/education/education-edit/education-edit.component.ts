import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EducationService } from 'src/app/core/services/education.service';
import { EducationDto } from 'src/app/core/to/EducationDto';

@Component({
  selector: 'app-education-edit',
  templateUrl: './education-edit.component.html',
  styleUrls: ['./education-edit.component.scss']
})
export class EducationEditComponent implements OnInit {

  title: string = 'Nueva Titulación';  
  itemData : EducationDto = new EducationDto();

  constructor(
    public dialogRef: MatDialogRef<EducationEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private educationService: EducationService,
  ) { 

    if (data) {
      this.itemData.id = data.id;
      this.itemData.name = data.name;

      if (data.id) this.title = 'Edición de Titulación';
    }
  }

  ngOnInit(): void {
  }


  save(): void {

    this.educationService.save(this.itemData).subscribe(() => {
      this.dialogRef.close(true);
    })
  }

  close(): void {
    this.dialogRef.close(false);
  }

}
