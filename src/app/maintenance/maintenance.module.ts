import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DegreeComponent } from './degree/degree.component';
import { UniversityComponent } from './university/university.component';
import { TechnologyComponent } from './technology/technology.component';
import { EnglishLevelComponent } from './english-level/english-level.component';
import { ActionComponent } from './action/action.component'; 
import { AgGridModule } from 'ag-grid-angular';




@NgModule({
  declarations: [DegreeComponent, UniversityComponent, TechnologyComponent, EnglishLevelComponent, ActionComponent],
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
  ]
})
export class MaintenanceModule { }
