import { AstMemoryEfficientTransformer } from '@angular/compiler';
import { Component, OnInit} from '@angular/core';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { ScholarDto } from 'src/app/core/to/ScholarDto';
import { ScholarService } from './services/scholar.service';

@Component({
  selector: 'app-scholar',
  templateUrl: './scholar.component.html',
  styleUrls: ['./scholar.component.scss']
})
export class ScholarComponent implements OnInit {

  columnDefSch: ColDef[] = [
    { field: 'username', headerName: 'Nombre de usuario' },
    { field: 'name', headerName: 'Nombre'}, 
    { field: 'lastname', headerName: 'Apellidos'}, 
    { field: 'customer', headerName: 'Cliente'},
    { field: 'hours', headerName: 'Horas Jornada'},
    { field: 'details', headerName: 'Detalle'},
    { field: 'start_date', headerName: 'Fecha inicio'}, 
    { field: 'end_date', headerName: 'Fecha fin'}, 
    { field: 'title', headerName: 'Titulación'}, 
    { field: 'action', headerName: 'Acción',
    valueGetter: function (params) {
      if (params.data.action == 1) {
          return 'Contrato';
      } else if (params.data.action == 0) {
          return 'Out';
      } else {
          return 'Continuar';
      }}},
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

  rowDataScholar : ScholarDto[] = [];

  defaultColDef : ColDef;

  gridOptions: GridOptions;

  api: GridApi = new GridApi;

  constructor( private scholarService: ScholarService ) 
  { 
    this.defaultColDef = {
      sortable: true,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      filterParams: {
        filterOptions: ["contains"],
        newRowsAction: 'keep',
      },

    };

    this.gridOptions = {
      getRowNodeId: (data) => data.id,
    };

  }

  ngOnInit(): void {
    this.scholarService.findScholars().subscribe( (res) => {
      this.rowDataScholar = res;
    }); 
  }

  onGridReady = (params: { api: GridApi;}) => {
    this.api = params.api;

    var filter = {

      active: {
        type: 'contains',
        filter: 'Activo'
      }
    };
    
    this.api.setFilterModel(filter);

    
  }

}
