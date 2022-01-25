import { Component, OnInit} from '@angular/core';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { PersonDto } from '../core/to/PersonDto';
import { MainService } from './services/main.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  buttonText: string = "Editar";

  editar = false;

  gridOptions: GridOptions;

  saveRows: number [] = [];

  api: GridApi = new GridApi;

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
      }}, 
      valueSetter: params => {
        var newValue = params.newValue;
        if(newValue == "Activo") {
          params.data.active = 1;
        }
        else if (newValue == "Baja") {
          params.data.active = 0;
        }
        else {
          params.data.active = 2;
        }
        return true;
    }},
  ];

  rowData : PersonDto[] = [];

  defaultColDef: ColDef;

  constructor(
    private mainService: MainService
  ) { 
    
    this.defaultColDef = {
      sortable: true,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      filterParams: {
        filterOptions: ["contains"],
        newRowsAction: 'keep',
      },
      editable: this.isEditing.bind(this),
      singleClickEdit: true,
    };

    this.gridOptions = {
      getRowNodeId: (data) => data.id,
    };

  }

  ngOnInit(): void {
    this.mainService.findPersons().subscribe( (res) => {
      this.rowData = res;
    });
  }

  onGridReady = (params: { api: GridApi;}) => {
    this.api = params.api;

    var filter = {

      department: {
        type: 'contains',
        filter: 'CCSw'
      },

      active: {
        type: 'contains',
        filter: 'Activo'
      }
    };

    this.api.setFilterModel(filter);
}

  isEditing(): boolean {
    return this.editar;
  }

  changeMode(): void {

    if(this.buttonText == "Editar") {
      this.buttonText = "Guardar y Finalizar";
      this.editar = true;
    }
    else {
      this.buttonText = "Editar";
      this.editar = false;
      this.save();
    }
  }

  onCellEditingStopped(e: any) {
    if(e.oldValue != e.newValue) {
      if(!this.saveRows.includes(e.node.data.id))
        this.saveRows.push(e.node.data.id);
    }
}

  save() {
    this.api.forEachNode(node => {
      if(this.saveRows.includes(node.data.id)) {
        this.mainService.saveOrUpdatePerson(node.data).subscribe(data => {
          node.updateData(data);
        });
      }
    });

    this.api?.onFilterChanged();
    this.saveRows = [];
  }
  }