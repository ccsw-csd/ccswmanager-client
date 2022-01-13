import { Component, OnInit} from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { PersonDto } from '../core/to/PersonDto';
import { MainService } from './services/main.service';
import { MainPersonDto } from './to/MainPersonDto';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  columnDefs: ColDef[] = [
    { field: 'saga', headerName: 'Saga'}, 
    { field: 'username', headerName: 'Nombre de usuario' },
    { field: 'department', headerName: 'Departamento'}, 
    { field: 'name', headerName: 'Nombre'}, 
    { field: 'lastname', headerName: 'Apellidos'}, 
    { field: 'customer', headerName: 'Cliente'},
    { field: 'grade', headerName: 'Grado'},
    { field: 'role', headerName: 'Rol'},
    { field: 'businesscode', headerName: 'Práctica'},
    { field: 'geography', headerName: 'Geografía'},
    { field: 'hours', headerName: 'Horas Jornada'},
    { field: 'details', headerName: 'Detalle'},
    { field: 'state', headerName: 'Estado'},
  ];

  rowData : MainPersonDto[] = [];

  constructor(
    private mainService: MainService
  ) { }

  ngOnInit(): void {
    this.mainService.findPersons().subscribe( (res) => {
      let persons: MainPersonDto[] = [];
      res.forEach(person => {
        persons.push(this.changePersonToMainPerson(person));
      });
      this.rowData = persons;
    });


  }

  private changePersonToMainPerson(person: PersonDto): MainPersonDto {
    let mainPerson: MainPersonDto;
    mainPerson = person;
    mainPerson.geography = person.center?.name;
    
    if(person.active == 1) {
      mainPerson.state = "Activo";
    }
    else if (person.active == 0) {
      mainPerson.state = "Baja";
    }
    else if (person.active == 2) {
      mainPerson.state = "Pendiente";
    }
    return mainPerson;
  }

}
