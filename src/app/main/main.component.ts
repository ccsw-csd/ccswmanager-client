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
import { AlertDialogComponent } from '../core/alert-dialog/alert-dialog.component';

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
      { field: 'saga', headerName: 'Saga', width: 114,
        cellStyle: params => {
          if(params.value?.length > 25) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'}; 
        }
      },

      { field: 'username', headerName: 'Username', width: 135,
        cellStyle: params => {
          if(params.value?.length > 25) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'}; 
        }
      },

      { field: 'name', headerName: 'Nombre', 
        cellStyle: params => {
          if (params.value == "" || params.value == null || params.value == undefined) {
            return {borderColor: 'gray'};
          }
          else if(params.value.length > 50) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'}; 
        }
      },

      { field: 'lastname', headerName: 'Apellidos', 
        cellStyle: params => {
          if (params.value == "" || params.value == null || params.value == undefined) {
            return {borderColor: 'gray'};
          }
          else if(params.value.length > 100) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'}; 
        }
      },

      { field: 'customer', headerName: 'Cliente',
        cellStyle: params => {
          if(params.value?.length > 100) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'}; 
        }
      },

      { field: 'grade', headerName: 'Grado', width: 112,
        cellStyle: params => {
          if(params.value?.length > 5) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'}; 
        }
      },

      { field: 'role', headerName: 'Rol', 
        cellStyle: params => {
          if(params.value?.length > 50) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'}; 
        }
      },

      { field: 'hours', headerName: 'Horas', width: 110,
        cellStyle: params => {
          if (params.value == "" || params.value == null || params.value == undefined) {
            return {borderColor: 'gray'};
          }
          else if(params.value.length > 10) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'}; 
        }
      },

      { field: 'businesscode', headerName: 'Práctica', width:130,
        cellStyle: params => {
          if(params.value?.length > 50) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'}; 
        }
      },

      { field: 'department', headerName: 'Departamento', width: 164,
        cellStyle: params => {
          if(params.value?.length > 10) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'}; 
        }
      },

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

      { field: 'details', headerName: 'Detalle',
        cellStyle: params => {
          if(params.value?.length > 200) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'}; 
        }
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
      if(this.validations()) {
        this.searchPersonsCtrl.setValue("");
        this.editar = false;
        this.save();
      }
      else {
        this.dialog.open(AlertDialogComponent, {
          data: { titulo: "Error", informacion: "No se pueden guardar los cambios, revisa los errores. <br /> Gris: Campo obligatorio <br /> Rojo: Dato demasiado largo "}
        });
      }
    }
  }

  undoChanges(): void {

    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: "Atención", description: "Vas a deshacer los cambios que hayas podido hacer en el listado y que no se hayan guardado.<br/>¿Estás seguro que deseas deshacer los cambios?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.editar = false;
        this.saveRows = [];
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
    this.searchPersonsCtrl.setValue("");
  }

  validations(): boolean {
    var correct = true;

    this.api.forEachNode(node => {

      if(this.saveRows.includes(node.data.id)) {
        if(this.isEmpty(node.data.name) || this.isEmpty(node.data.lastname) || this.isEmpty(node.data.active) || this.isEmpty(node.data.hours) || this.isEmpty(node.data.center)) {
          correct = false;
        }
        else if(node.data.name?.length > 50 || node.data.saga?.length > 25 || node.data.username?.length > 25 || node.data.department?.length > 10
          || node.data.lastname?.length > 100 || node.data.customer?.length > 100 || node.data.grade?.length > 5 || node.data.role?.length > 50
          || node.data.businesscode?.length > 50 || node.data.details?.length > 200) {
          correct = false;
        }
      }
    });

    return correct;
  }
  isEmpty(value: any) {
    return value === undefined || value === null || value === '';
  }
}
