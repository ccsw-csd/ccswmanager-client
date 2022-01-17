import { Component, OnInit} from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { PersonDto } from '../core/to/PersonDto';
import { MainService } from './services/main.service';

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
    { field: 'center.name', headerName: 'Geografía'},
    { field: 'hours', headerName: 'Horas Jornada'},
    { field: 'details', headerName: 'Detalle'},
    { field: 'active', headerName: 'Estado', 
    valueGetter: function (params) {
      if (params.data.active == 1) {
          return 'Activo';
      } else if (params.data.active == 0) {
          return 'Baja';
      } else {
          return 'Pendiente';
      }}},
  ];

  rowData : PersonDto[] = [];

  defaultColDef = {
    sortable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    caseSensitive: false,
    suppressAndOrCondition: true,
    filterParams: {
      filterOptions: ["contains"],
    }
  };

  constructor(
    private mainService: MainService
  ) { }

  ngOnInit(): void {
    this.mainService.findPersons().subscribe( (res) => {
      this.rowData = res;
    });
  }
}
