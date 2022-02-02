import { Component, OnInit} from '@angular/core';
import { ColDef, GridApi, GridOptions} from 'ag-grid-community';
import { PersonDto } from '../core/to/PersonDto';
import { MainService } from './services/main.service';
import { DialogComponent } from '../core/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  editar = false;

  gridOptions: GridOptions;

  saveRows: number [] = [];

  api: GridApi = new GridApi;

  centers: string[] = [];

  columnDefs: ColDef[];
  
  rowData : PersonDto[] = [];
  
  defaultColDef: ColDef;

  constructor(
    private mainService: MainService,
    public dialog: MatDialog,
  ) {
    this.columnDefs = [
      { field: 'saga', headerName: 'Saga', width: 114},
      { field: 'username', headerName: 'Nombre de usuario', width: 186},
      { field: 'department', headerName: 'Departamento', width: 164}, 
      { field: 'name', headerName: 'Nombre'},
      { field: 'lastname', headerName: 'Apellidos'},
      { field: 'customer', headerName: 'Cliente'},
      { field: 'grade', headerName: 'Grado', width: 112},
      { field: 'role', headerName: 'Rol'},
      { field: 'businesscode', headerName: 'Práctica', width:130},
      { field: 'center', headerName: 'Geografía', width: 130,
      cellEditor: 'agSelectCellEditor',
      valueGetter: function (params) {
        return params.data.center.name;
        },
        valueSetter: params => {
          var newValue = params.newValue;
          var id = this.centers.indexOf(newValue);
          params.data.center.id = id;
          params.data.center.name = newValue;
          return true;
        }
      },

      { field: 'hours', headerName: 'Horas Jornada', width: 162},
      { field: 'details', headerName: 'Detalle'},
      { field: 'active', headerName: 'Estado', width: 170,
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
      },
      cellEditor: 'agSelectCellEditor',
              cellEditorParams: {
                  values: ['Activo', 'Baja', 'Pendiente'],
              },
      }];
  
    
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
    
    this.getPersons();

    this.mainService.findCenters().subscribe((res) => {
      res.forEach(center => {
        if(center.id != undefined && center.name) {
        this.centers[center.id] = center.name;}
        
      });
      var column = this.api.getColumnDef('center');
      if (column != null) {
        column.cellEditorParams = { values: this.centers}
    }});
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

    if(this.editar == false) {
      this.editar = true;
    }
    else {
      this.editar = false;
      this.save();
    }
  }

  undoChanges(): void {

    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: "Atención", description: "Vas a deshacer los cambios que hayas podido hacer en el listado y que no se hayan guardado.<br/>¿Estás seguro que deseas deshacer los cambios?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.editar = false;
        this.getPersons();
      }
    });
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

  getPersons() {
    this.mainService.findPersons().subscribe( (res) => {
      this.rowData = res;
    });
  }
  }