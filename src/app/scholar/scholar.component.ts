import { AstMemoryEfficientTransformer } from '@angular/compiler';
import { Component, OnInit} from '@angular/core';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import * as moment from 'moment';
import { ScholarDto } from 'src/app/core/to/ScholarDto';
import { ScholarService } from './services/scholar.service';

@Component({
  selector: 'app-scholar',
  templateUrl: './scholar.component.html',
  styleUrls: ['./scholar.component.scss']
})
export class ScholarComponent implements OnInit {

  buttonText: string = "Editar";
  editar = false;
  saveRows: number [] = [];

  rowDataScholar : ScholarDto[] = [];

  defaultColDef : ColDef;

  gridOptions: GridOptions;

  api: GridApi = new GridApi;

  columnDefSch: ColDef[] = [
    { field: 'username', headerName: 'Nombre de usuario', cellStyle: {'background-color': '#F8F8F8'}},
    { field: 'name', headerName: 'Nombre', cellStyle: {'background-color': '#F8F8F8'}}, 
    { field: 'lastname', headerName: 'Apellidos', cellStyle: {'background-color': '#F8F8F8'}}, 
    { field: 'customer', headerName: 'Cliente', cellStyle: {'background-color': '#F8F8F8'}},
    { field: 'hours', headerName: 'Horas Jornada', cellStyle: {'background-color': '#F8F8F8'}},
    { field: 'details', headerName: 'Detalle', cellStyle: {'background-color': '#F8F8F8'}},
    { field: 'start_date', headerName: 'Fecha inicio', editable: this.isEditing.bind(this),
      singleClickEdit: true,
      valueFormatter : function(params) {
        if(params.data.start_date != null)
          return moment(params.data.start_date).format('MM/DD/YYYY');
        else
          return params.data.start_date;
      }
    }, 
    { field: 'end_date', headerName: 'Fecha fin', editable: this.isEditing.bind(this),
      singleClickEdit: true,
      valueFormatter : function(params) {
        if(params.data.start_date != null)
          return moment(params.data.start_date).format('MM/DD/YYYY');
        else
          return params.data.start_date;
      }
    }, 
    { field: 'title', headerName: 'Titulación', editable: this.isEditing.bind(this),
      singleClickEdit: true}, 
    { field: 'action', headerName: 'Acción', editable: this.isEditing.bind(this),
      singleClickEdit: true, 
      valueGetter: function (params) {
        if (params.data.action == 1) {
            return 'Contrato';
        } else if (params.data.action == 0) {
            return 'Out';
        } else {
            return 'Continuar';
        }
      }},
    { field: 'active', headerName: 'Estado', 
      valueGetter: function (params) {
        if (params.data.active == 1) {
            return 'Activo';
        } else if (params.data.active == 0) {
            return 'Baja';
        } else {
            return 'Pendiente';
        }
      }},
  ];

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
        this.scholarService.saveOrUpdateScholar(node.data).subscribe(data => {
          node.updateData(data);
        });
      }
    });

    this.api?.onFilterChanged();
    this.saveRows = [];
  }

}
