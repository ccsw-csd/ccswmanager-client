import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EducationComponent } from './education/education.component';
import { EducationCenterComponent } from './education-center/education-center.component';
import { TechnologyComponent } from './technology/technology.component';
import { EnglishLevelComponent } from './english-level/english-level.component';
import { ActionComponent } from './action/action.component'; 
import { AgGridModule } from 'ag-grid-angular';
import { EducationEditComponent } from './education/education-edit/education-edit.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnglishLevelEditComponent } from './english-level/english-level-edit/english-level-edit.component';
import { ActionEditComponent } from './action/action-edit/action-edit.component';
import { EducationCenterEditComponent } from './education-center/education-center-edit/education-center-edit.component';
import { TechnologyEditComponent } from './technology/technology-edit/technology-edit.component';




@NgModule({
  declarations: [EducationComponent, EducationCenterComponent, TechnologyComponent, EnglishLevelComponent, ActionComponent, EducationEditComponent, EnglishLevelEditComponent, ActionEditComponent, EducationCenterEditComponent, TechnologyEditComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([]),
  ]
})
export class MaintenanceModule { }
