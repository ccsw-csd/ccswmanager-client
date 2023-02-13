import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EducationCenterService } from 'src/app/core/services/education-center.service';
import { EducationCenterDto } from 'src/app/core/to/EducationCenterDto';

@Component({
  selector: 'app-education-center-edit',
  templateUrl: './education-center-edit.component.html',
  styleUrls: ['./education-center-edit.component.scss']
})
export class EducationCenterEditComponent implements OnInit {

  title: string = 'Nuevo Centro Educativo';  
  itemData : EducationCenterDto = new EducationCenterDto();

  constructor(
    public dialogRef: MatDialogRef<EducationCenterEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private educationCenterService: EducationCenterService,
  ) { 

    if (data) {
      this.itemData.id = data.id;
      this.itemData.name = data.name;

      if (data.id) this.title = 'Edición de Centro Educativo';
    }
  }

  ngOnInit(): void {
  }


  save(): void {

    this.educationCenterService.save(this.itemData).subscribe(() => {
      this.dialogRef.close(true);
    })
  }

  close(): void {
    this.dialogRef.close(false);
  }

}
