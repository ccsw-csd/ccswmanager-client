import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EducationCenterService } from 'src/app/core/services/education-center.service';
import { EducationCenterDto } from 'src/app/core/to/EducationCenterDto';
import { ProvinceDto } from 'src/app/core/to/ProvinceDto';
import { PersonalService } from 'src/app/personal/services/personal.service';

@Component({
  selector: 'app-education-center-edit',
  templateUrl: './education-center-edit.component.html',
  styleUrls: ['./education-center-edit.component.scss']
})
export class EducationCenterEditComponent implements OnInit {

  title: string = 'Nuevo Centro Educativo';  
  itemData : EducationCenterDto = new EducationCenterDto();

  selectedProvince: string;
  provinces: ProvinceDto[] = [];

  constructor(
    public dialogRef: MatDialogRef<EducationCenterEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private educationCenterService: EducationCenterService,
    private personalService: PersonalService
  ) { 

    if (data) {
      this.itemData.id = data.id;
      this.itemData.name = data.name;
      this.itemData.type = data.type;
      this.itemData.province = data.province;

      this.selectedProvince = data.province?.province;

      if (data.id) this.title = 'Edición de Centro Educativo';
    }
  }

  ngOnInit(): void {
    this.getProvinces();
  }

  getProvinces() : void {
    this.personalService.findProvince().subscribe((res) => {
      this.provinces = res;
    });
  }

  save(): void {
    this.itemData.province = this.provinces.find(e => e.province == this.selectedProvince);

    this.educationCenterService.save(this.itemData).subscribe(() => {
      this.dialogRef.close(true);
    })
  }

  close(): void {
    this.dialogRef.close(false);
  }

}
