import { AstMemoryEfficientTransformer } from '@angular/compiler';
import { Component, OnInit} from '@angular/core';
import { DialogComponent } from '../core/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { iif } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CellClickedEvent, ColDef, GridApi, GridOptions} from 'ag-grid-community';
import * as moment from 'moment';
import ResizeObserver from 'resize-observer-polyfill';

import { TimelineDialogComponent } from './timeline-dialog/timeline-dialog.component';

import { PersonalService } from '../personal/services/personal.service';
import { ScholarService } from './services/scholar.service';

import { PersonDto } from '../core/to/PersonDto';
import { VScholarDto } from 'src/app/core/to/VScholarDto';
import { AlertDialogComponent } from '../core/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-scholar',
  templateUrl: './scholar.component.html',
  styleUrls: ['./scholar.component.scss']
})
export class ScholarComponent implements OnInit {

  edit: boolean = false;

  gridOptions: GridOptions;
  api: GridApi = new GridApi;
  
  columnDefs: ColDef[];
  defaultColDef : ColDef;

  searchPersonsCtrl = new FormControl();
  isLoading: boolean = false;
  errorMsg: string | undefined;

  rowData : VScholarDto[] = [];
  saveRows: VScholarDto[] = [];
  deleteScholar: VScholarDto[] = [];
  persons: any[] = [];

  centers: string[] = [];
  provinces: string[] = [];

  public dialogRef : TimelineDialogComponent | any;

  constructor( 
    private scholarService: ScholarService, 
    private personalService: PersonalService, 
    public dialog: MatDialog
  ) {

    this.columnDefs = [
      { field: 'delete', headerName:'', minWidth: 60, maxWidth: 60, floatingFilter: false, editable: false,
        cellRenderer: function(params) {
          return '<span><i class="material-icons" style="margin-top:10px; color: lightcoral;">clear</i></span>'
        },
        onCellClicked: (event: CellClickedEvent) => this.delete(event), sortable:false, hide: true
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

      { field: 'hours', headerName: 'Horas', maxWidth: 75, minWidth: 75,
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

      { field: 'department', headerName: 'Departamento', maxWidth: 145, minWidth: 145,
        cellStyle: params => {
          if(params.value?.length > 10) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        }
      },

      { field: 'manager', headerName: 'Responsable', maxWidth: 200, minWidth: 150,
        cellStyle: params => {
          if(params.value?.length > 200) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        }
      },

      { field: 'center', headerName: 'Oficina', maxWidth: 114, minWidth: 114,
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

      { field: 'province', headerName: 'Localización', maxWidth: 150, minWidth: 150,
        cellEditor: 'agSelectCellEditor',
        valueGetter: function (params) {
          if (params.data.province == null || params.data.province == "" || params.data.province == undefined) {
              return '';
          }
          else {
            return params.data.province.province;
          }
        },
        valueSetter: params => {
          var newValue = params.newValue;
          var id = this.provinces.indexOf(newValue);
          if (newValue == null || newValue == "" || newValue == undefined) {
            params.data.province = null;
          }
          else{
            params.data.province = {id: id, province: newValue};
          }
          return true;
        }
      },

      { field: 'startDate', headerName: 'Inicio', maxWidth: 130, minWidth: 130,
        cellEditorPopup: false, comparator : this.dateComparator,
        valueGetter : function(params) {
          if(params.data.startDate != null){
            return moment(params.data.startDate).format('DD/MM/YYYY');
          }
          else
            return params.data.startDate;
        },
        valueSetter: params => {
          var newValue = params.newValue;
          if (newValue == ""){
            params.data.startDate = null;
          }
          else if(newValue != null) {
            var dateParts = newValue.split('/');
            params.data.startDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
          }
          return true;
        }

      },
      { field: 'endDate', headerName: 'Fin', maxWidth: 130, minWidth: 130,
        cellEditorPopup: false, comparator : this.dateComparator,
        valueGetter : function(params) {
          if(params.data.endDate != null)
            return moment(params.data.endDate).format('DD/MM/YYYY');
          else
            return params.data.endDate;
        },
        valueSetter: params => {
          var newValue = params.newValue;
          if (newValue == ""){
            params.data.endDate = null;
          }
          else if(newValue != null) {
            var dateParts = newValue.split('/');
            params.data.endDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
          }
          return true;
        }
      },

      { field: 'title', headerName: 'Titulación', maxWidth: 100, minWidth: 100,
        cellStyle: params => {
          if(params.value?.length > 25) {
            return {borderColor: 'lightcoral'};
          }
          return {borderColor: 'transparent'};
        }
      },

      { field: 'pon', headerName: 'PON', maxWidth: 100, minWidth: 100,
      cellStyle: params => {
        if(params.value?.length > 50) {
          return {borderColor: 'lightcoral'};
        }
        return {borderColor: 'transparent'};
      }
    },

      { field: 'action', headerName: 'Acción', maxWidth: 100, minWidth: 100,
        valueGetter: function (params) {
          if (params.data.action == 1) {
              return 'Contrato';
          } else if (params.data.action == 0) {
              return 'Out';
          } else if (params.data.action == 2){
              return 'Continuar';
          }
          else{
            return '';
          }
        },
        valueSetter: params => {
          var newValue = params.newValue;
          if(newValue == "Contrato") {
            params.data.action = 1;
          }
          else if (newValue == "Out") {
            params.data.action = 0;
          }
          else if (newValue == "Continuar"){
            params.data.action = 2;
          }
          else{
            params.data.action = null;
          }
          return true;
        },
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['', 'Out', 'Contrato', 'Continuar'],
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
            values: ['Activo', 'Inactivo', 'Pendiente']
        }
      }
    ];

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

    this.gridOptions = {
      getRowNodeId: (data) => data.id,
    };
  }

  ngOnInit(): void {
    this.getScholars();
    this.getCenters();
    this.getProvinces();

    this.searchPersonsCtrl.valueChanges.pipe(
      debounceTime(100),
      tap(() => {
        this.errorMsg = '';
        this.persons = [];
        this.isLoading = true;
      }),
      switchMap(value =>
        iif(() => value.length > 2,
        this.personalService.findScholarsByFilter(value))
        .pipe(
          finalize(() => { this.isLoading = false; })
        )
      )
    ).subscribe((data: any) => {
      this.persons = this.persons.concat(data);
    });
  }

  getScholars() : void {
    this.scholarService.findScholars().subscribe((res) => {
      this.rowData = res;
    });
  }

  getCenters() : void {
    this.personalService.findCenters().subscribe((res) => {
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
  }

  getProvinces() : void {
    this.personalService.findProvince().subscribe((res) => {
      res.forEach(provinceKey => {
        if(provinceKey.id != undefined && provinceKey.province) {
          this.provinces[provinceKey.id] = provinceKey.province;
        }
        this.provinces[0] = '';
      });
      var column = this.api.getColumnDef('province');
      if (column != null) {
        column.cellEditorParams = { values: this.provinces}
      }
    });
  }

  onGridReady = (params: { api: GridApi;}) => {
    this.api = params.api;

    const filter = {
      active: {
        type: 'equals',
        filter: 'Activo'
      }
    };

    const sort = [
      {colId: 'endDate', sort: 'asc'}
    ];

    this.api.setFilterModel(filter);
    this.api.setSortModel(sort);
    this.api.sizeColumnsToFit();
    let agGrid = document.getElementById('agGridSholar');
    let obs = new ResizeObserver(entries => {
      for (let entry of entries) {
        this.api.sizeColumnsToFit();
      }
    });
    if(agGrid != null)
      obs.observe(agGrid);
  }

  isEditing(): boolean {
    return this.edit;
  }

  changeMode(): void {
    if(this.edit == false) {
      this.edit = true;
      this.gridOptions.columnApi?.setColumnVisible('delete', true);
      this.api.sizeColumnsToFit();
    } else {
      if(this.validations()) {
        this.searchPersonsCtrl.setValue("");
        this.edit = false;
        this.gridOptions.columnApi?.setColumnVisible('delete', false);
        this.api.sizeColumnsToFit();
        this.save();
      } else {
        this.dialog.open(AlertDialogComponent, {
          data: { titulo: "Error", informacion: "Existen campos que tienen errores o bien no pueden ser vacíos o bien el texto es demasiado largo.<br />Por favor, revise los errores antes de guardar los datos."}
        });
      }
    }
  }

  validations(): boolean {
    var correct = true;

    this.api.forEachNode(node => {
      if(this.saveRows.includes(node.data.id)) {
        if(this.isEmpty(node.data.name) || this.isEmpty(node.data.lastname) || this.isEmpty(node.data.active) || this.isEmpty(node.data.hours) || this.isEmpty(node.data.center)) {
          correct = false;
        } else if(node.data.name?.length > 50 || node.data.saga?.length > 25 || node.data.username?.length > 25 || node.data.department?.length > 10
          || node.data.lastname?.length > 100 || node.data.customer?.length > 100 || node.data.grade?.length > 5 || node.data.role?.length > 50
          || node.data.businesscode?.length > 50 || node.data.details?.length > 200 || node.data.manager?.length > 200 || node.data.pon?.length > 50) {
          correct = false;
        }
      }
    });
    return correct;
  }

  isEmpty(value: any): boolean {
    return value === undefined || value === null || value === '';
  }

  undoChanges(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: "Atención", description: "Vas a deshacer los cambios que hayas podido hacer en el listado y que no se hayan guardado.<br/>¿Estás seguro que deseas deshacer los cambios?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.edit = false;
        this.gridOptions.columnApi?.setColumnVisible('delete', false);
        this.api.sizeColumnsToFit();
        this.saveRows = [];
        this.deleteScholar = [];
        this.searchPersonsCtrl.setValue("");
        this.getScholars();
      }
    });
  }

  onCellEditingStopped(e: any) {
    if(e.oldValue != e.newValue) {
      if(!this.saveRows.includes(e.node.data))
        this.saveRows.push(e.node.data);
    }
  }

  save(): void {
    var scholarsChanged: VScholarDto[] = [];

    this.api.forEachNode(node => {
      if(this.saveRows.includes(node.data)) {
        scholarsChanged.push(node.data);
      }
    });

    scholarsChanged = scholarsChanged.concat(this.deleteScholar);

    this.scholarService.saveOrUpdateScholars(scholarsChanged).subscribe(data => {
      this.rowData = data;
    });

    this.api?.onFilterChanged();
    this.saveRows = [];
    this.deleteScholar = [];
  }

  addPersonToData(person: PersonDto): void {

    var scholar: VScholarDto = new VScholarDto();

    scholar.id = person.id;
    scholar.saga = person.saga;
    scholar.username = person.username;
    scholar.email = person.email;
    scholar.name = person.name;
    scholar.lastname = person.lastname;

    if(person.hours == null) {
      scholar.hours = 5;
    }
    if(person.active == null) {
      scholar.active = 1;
    }
    scholar.businesscode = 'CCA';
    if(person.department == null) {
      scholar.department = 'CCSw';
    }
    if(person.center == null) {
      scholar.center = {id: 6, name: 'Valencia'};
    } else {
      scholar.center = person.center;
    }
    if (person.role == null){
      scholar.role = 'Dev. Fullstack';
    }
    if (person.province == null) {
      var idProvince = this.provinces.findIndex(province => province == scholar.center?.name);
      scholar.province = {id: idProvince, province: this.provinces[idProvince]};
    }

    this.rowData = this.rowData.concat([scholar]);
    this.searchPersonsCtrl.setValue("");
    this.saveRows.push(scholar);
  }

  delete(event: CellClickedEvent): void {
    var rowNode;
    if(event.node.id != undefined)
      rowNode = this.api.getRowNode(event.node.id);

    var index = this.rowData.indexOf(rowNode?.data);
    this.rowData.splice(index, 1);
    this.api.setRowData(this.rowData);

    var scholar: VScholarDto = rowNode?.data;

    if(this.saveRows.includes(scholar)) {
      var indexSave = this.saveRows.indexOf(scholar);
      this.saveRows.splice(indexSave, 1);
    }

    if(scholar.id != null && scholar.id != undefined) {
      scholar.delete = true;
      this.deleteScholar.push(scholar);
    }
  }

  openTimeLine(): void {
    this.dialogRef = this.dialog.open(TimelineDialogComponent, {
      data: {},
      width: '80vw',
      height: '90vh'
    });
  }

  resizeGrid(): void {
    this.api.sizeColumnsToFit();
  }

  dateComparator(date1 : any, date2 : any) {
    var date1Number = date1 && moment(date1, "DD/MM/YYYY").valueOf();
    var date2Number = date2 && moment(date2, "DD/MM/YYYY").valueOf();


    if (date1Number == null && date2Number == null) {
      return 0;
    }

    if (date1Number == null) {
      return -1;
    } else if (date2Number == null) {
      return 1;
    }

    return date1Number - date2Number;
  }

}
