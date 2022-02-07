import { Component, Inject, OnInit} from '@angular/core';
import { ColDef, GridApi, GridOptions} from 'ag-grid-community';
import { PersonDto } from '../core/to/PersonDto';
import { MainService } from './services/main.service';
import { DialogComponent } from '../core/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { iif } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

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

  searchPersonsCtrl = new FormControl();
  isLoading = false;
  persons: any[] = [];
  errorMsg: string | undefined;

  constructor(
    private mainService: MainService,
    public dialog: MatDialog,
    @Inject (MatAutocompleteModule) public auto: string
  ) {
    this.columnDefs = [
      { field: 'saga', headerName: 'Saga', width: 114},
      { field: 'username', headerName: 'Username', width: 135},
      { field: 'name', headerName: 'Nombre'},
      { field: 'lastname', headerName: 'Apellidos'},
      { field: 'customer', headerName: 'Cliente'},
      { field: 'grade', headerName: 'Grado', width: 112},
      { field: 'role', headerName: 'Rol'},
      { field: 'hours', headerName: 'Horas', width: 110},
      { field: 'businesscode', headerName: 'Práctica', width:130},
      { field: 'department', headerName: 'Departamento', width: 164}, 
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
      { field: 'active', headerName: 'Estado', width: 120,
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
      },
      { field: 'details', headerName: 'Detalle'},];
  
    
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

    this.searchPersonsCtrl.valueChanges
    .pipe(
      debounceTime(100),
      tap(() => {
        this.errorMsg = '';
        this.persons = [];
        this.isLoading = true;


      }),
      switchMap(value =>
        iif(() => value.length > 2,
        this.mainService.findPersonsByFilter(value))
        .pipe(
          finalize(() => { this.isLoading = false; }),
        )
      )
    )
    .subscribe((data: any) => {
      this.persons = this.persons.concat(data);
    }
  );
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
      this.searchPersonsCtrl.setValue("");
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
        this.searchPersonsCtrl.setValue("");
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
      if(this.saveRows.includes(node.data.id) || node.data.id == null) {
        this.mainService.saveOrUpdatePerson(node.data).subscribe(data => {
          node.updateData(data);
          this.getPersons();
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

  addPersonToData(person: PersonDto) {
    if(person.hours == null) {
      person.hours = 8;
    }
    if(person.active == null) {
      person.active = 1;
    }
    if(person.department == null) {
      person.department = 'CCSw';
    }
    if(person.center == null) {
      person.center = {id:6, name: 'Valencia'};
    }
    this.rowData = this.rowData.concat([person]);
  }
  }
