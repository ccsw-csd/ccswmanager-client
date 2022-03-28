import { Component, Inject, OnInit} from '@angular/core';
import { CellClickedEvent, ColDef, ColumnApi, GridApi, GridOptions} from 'ag-grid-community';
import { PersonDto } from '../core/to/PersonDto';
import { MainService } from './services/main.service';
import { DialogComponent } from '../core/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { iif } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AlertDialogComponent } from '../core/alert-dialog/alert-dialog.component';
import ResizeObserver from 'resize-observer-polyfill';
import { LdapDialogComponent } from './ldap-dialog/ldap-dialog.component';
import {MatTabsModule} from '@angular/material/tabs';
import { PersonRoleDto } from '../core/to/PersonRoleDto';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  editar = false;

  gridOptions: GridOptions;

  saveRows: PersonDto [] = [];

  deletePersons: PersonDto [] = [];

  api: GridApi = new GridApi;

  centers: string[] = [];

  columnDefs: ColDef[];

  rowData : PersonDto[] = [];

  defaultColDef: ColDef;

  personas: number = 0;

  becarios: number = 0;

  contratos: number = 0;

  grades: string[] = ["N/A", "A1", "A2", "B1", "B2", "B3", "C1", "C2", "C3", "D1", "D2", "E1", "E2", "VP"];

  personRoles : string[] = [];

  searchPersonsCtrl = new FormControl();
  isLoading = false;
  persons: any[] = [];
  errorMsg: string | undefined;

  ldap:boolean = true;

  constructor(
    private mainService: MainService,
    public dialog: MatDialog,
    @Inject (MatAutocompleteModule) public auto: string
  ) {

    this.columnDefs = [
      { field: 'delete', headerName:'', minWidth: 60, maxWidth: 60, floatingFilter: false, editable: false,
      cellRenderer: function(params) {
        return '<span><i class="material-icons" style="margin-top:10px; color: lightcoral;">clear</i></span>'
      },
      onCellClicked: (event: CellClickedEvent) => this.delete(event), sortable:false, hide: true
      },

      { field: 'saga', headerName: 'Saga', maxWidth: 96, minWidth: 96,
        cellStyle: params => {
          if(params.value?.length > 25) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        }
      },

      { field: 'username', headerName: 'Username', maxWidth: 120, minWidth: 120,
        cellStyle: params => {
          if(params.value?.length > 25) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        }
      },

      { field: 'name', headerName: 'Nombre', maxWidth: 200, minWidth: 150,
        cellStyle: params => {
          if (params.value == "" || params.value == null || params.value == undefined) {
            return {borderColor: 'lightcoral'};
          }
          else if(params.value.length > 50) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        }
      },

      { field: 'lastname', headerName: 'Apellidos', minWidth: 150,
        cellStyle: params => {
          if (params.value == "" || params.value == null || params.value == undefined) {
            return {borderColor: 'lightcoral'};
          }
          else if(params.value.length > 100) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        }
      },

      { field: 'customer', headerName: 'Cliente', maxWidth: 200, minWidth: 150,
        cellStyle: params => {
          if(params.value?.length > 100) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        }
      },

      { field: 'grade', headerName: 'Grado', maxWidth: 95, minWidth: 95,
        cellStyle: params => {
          if(params.value?.length > 5 || !this.grades.includes(params.value)) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        },
        valueGetter: function (params) {
          if (params.data.grade == null || params.data.grade == "" || params.data.grade == undefined) {
              return 'N/A';
          }
          else {
            return params.data.grade;
          }
        },
        valueSetter: params => {
          var newValue = params.newValue;
          if(newValue == "N/A") {
            params.data.grade = "";
          }
          else {
            params.data.grade = newValue;
          }
          return true;
        }

      },
      { field: 'role', headerName: 'Rol', maxWidth: 170, minWidth: 170,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: this.personRoles,
        },
        valueSetter: params => {
          var newValue = params.newValue;
          params.data.role = newValue;
          return true;
        }
      },

      { field: 'hours', headerName: 'Horas', maxWidth: 95, minWidth: 95,
        cellStyle: params => {
          if (params.value == "" || params.value == null || params.value == undefined) {
            return {borderColor: 'lightcoral'};
          }
          else if(params.value.length > 10) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        }
      },

      { field: 'businesscode', headerName: 'Práctica', maxWidth:115, minWidth:115,
        cellStyle: params => {
          if(params.value?.length > 50) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        }
      },

      { field: 'department', headerName: 'Departamento', maxWidth: 145, minWidth: 145,
        cellStyle: params => {
          if(params.value?.length > 10) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        }
      },

      { field: 'center', headerName: 'Geografía', maxWidth: 114, minWidth: 114,
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

      { field: 'active', headerName: 'Estado', maxWidth: 98, minWidth: 98,
        valueGetter: function (params) {
          if (params.data.active == 1) {
              return 'Activo';
          } else if (params.data.active == 0) {
              return 'Inactivo';
          } else {
              return 'Pendiente';
          }},
        valueSetter: params => {
          var newValue = params.newValue;
          if(newValue == "Activo") {
            params.data.active = 1;
          }
          else if (newValue == "Inactivo") {
            params.data.active = 0;
          }
          else {
            params.data.active = 2;
          }
          return true;
        },
        cellEditor: 'agSelectCellEditor',
                cellEditorParams: {
                    values: ['Activo', 'Inactivo', 'Pendiente'],
                },
      }];


    this.defaultColDef = {
      sortable: true,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      filterParams: {
        filterOptions: ["contains","equals"],
        newRowsAction: 'keep',
      },
      floatingFilterComponentParams: {suppressFilterButton:true},
      suppressMenu:true,
      editable: this.isEditing.bind(this),
      singleClickEdit: true
    };

    this.gridOptions = {};

  }

  ngOnInit(): void {

    this.mainService.findPersonRoles().subscribe((res) => {
      res.forEach(pRole => {
        if(pRole.id != undefined && pRole.role) {
          this.personRoles[pRole.id] = pRole.role;
        }
        this.personRoles[0] = '';
      });
      var column = this.api.getColumnDef('role');
      if (column != null) {
        column.cellEditorParams = { values: this.personRoles}
      }
      });
    this.getPersons();

    this.mainService.findCenters().subscribe((res) => {
      res.forEach(center => {
        if(center.id != undefined && center.name) {
        this.centers[center.id] = center.name;
      }
      });
      var column = this.api.getColumnDef('center');
      if (column != null) {
        column.cellEditorParams = { values: this.centers}
      }
    });

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

  onGridReady = (params: { api: GridApi; columnApi: ColumnApi}) => {
    this.api = params.api;

    const filter = {
      department: {
        type: 'contains',
        filter: 'CCSw'
      },
      active: {
        type: 'equals',
        filter: 'Activo'
      }
    };

    const sort = [
      {colId: 'lastname', sort: 'asc'}
    ];

    this.api.setFilterModel(filter);
    this.api.setSortModel(sort);
    this.api.sizeColumnsToFit();
    let agGrid = document.getElementById('agGrid');
    let obs = new ResizeObserver(entries => {
      for (let entry of entries) {
        this.api.sizeColumnsToFit();
      }
    });
    if(agGrid != null)
      obs.observe(agGrid);
}

  isEditing(): boolean {
    return this.editar;
  }

  changeMode(): void {

    if(this.editar == false) {
      this.editar = true;
      this.gridOptions.columnApi?.setColumnVisible('delete', true);
      this.api.sizeColumnsToFit();
    }
    else {
      if(this.validations()) {
        this.searchPersonsCtrl.setValue("");
        this.editar = false;
        this.gridOptions.columnApi?.setColumnVisible('delete', false);
        this.api.sizeColumnsToFit();
        this.save();
      }
      else {
        this.dialog.open(AlertDialogComponent, {
          data: { titulo: "Error", informacion: "Existen campos que tienen errores o bien no pueden ser vacíos o bien el texto es demasiado largo.<br />Por favor, revise los errores antes de guardar los datos."}
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
        this.gridOptions.columnApi?.setColumnVisible('delete', false);
        this.api.sizeColumnsToFit();
        this.saveRows = [];
        this.deletePersons = [];
        this.searchPersonsCtrl.setValue("");
        this.getPersons();
      }
    });
  }

  onCellEditingStopped(e: any) {
    if(e.oldValue != e.newValue) {
      if(!this.saveRows.includes(e.node.data))
        this.saveRows.push(e.node.data);
    }
  }

  save() {
    var personsChanged: PersonDto[] = [];

    this.api.forEachNode(node => {
      if(this.saveRows.includes(node.data)){
        personsChanged.push(node.data);
      }
    });

    personsChanged = personsChanged.concat(this.deletePersons);

    this.mainService.saveOrUpdatePersons(personsChanged).subscribe(data => {
      this.rowData = data;
      this.checkLDAP();
    });

    this.api?.onFilterChanged();
    this.saveRows = [];
    this.deletePersons = [];
  }


  getPersons() {
    this.mainService.findPersons().subscribe( (res) => {
      this.rowData = res;
      this.checkLDAP();
    });
  }

  updateChips() {
    this.becarios = 0;
    this.contratos = 0;
    this.personas = 0;

    this.api.forEachNodeAfterFilter(node => {
      this.personas++;
      if(this.isEmpty(node.data.grade)) {
        this.becarios++;
      }
      else {
        this.contratos++;
      }
    });
  }

  checkLDAP() {
    this.mainService.checkLDAP().subscribe((res) => {
      this.ldap = res;
    })
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
    if (person.role == null){
      person.role = "";
    }
    this.rowData = this.rowData.concat([person]);
    this.searchPersonsCtrl.setValue("");
    this.saveRows.push(person);
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
        else if (!this.grades.includes(node.data.grade) && !this.isEmpty(node.data.grade)) {
          correct = false;
        }
      }
    });

    return correct;
  }
  isEmpty(value: any) {
    return value === undefined || value === null || value === '';
  }

  resizeGrid() {
    this.api.sizeColumnsToFit();
  }

  firstDataRendered(){
    this.resizeGrid();
    this.updateChips();
  }

  openLDAP() {
    const dialogRef = this.dialog.open(LdapDialogComponent, {
      data: {}
    });
  }

  delete(event: CellClickedEvent) {
    var rowNode;
    if(event.node.id != undefined)
      rowNode = this.api.getRowNode(event.node.id);

    var index = this.rowData.indexOf(rowNode?.data);
    this.rowData.splice(index, 1);
    this.api.setRowData(this.rowData);

    var person: PersonDto = rowNode?.data;

    if(this.saveRows.includes(person)) {
      var indexSave = this.saveRows.indexOf(person);
      this.saveRows.splice(indexSave, 1);
    }

    if(person.id != null && person.id != undefined) {
      person.delete = true;
      this.deletePersons.push(person);
    }

  }
}
