import { AstMemoryEfficientTransformer } from '@angular/compiler';
import { Component, OnInit} from '@angular/core';
import { DialogComponent } from '../core/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridApi, GridOptions} from 'ag-grid-community';
import * as moment from 'moment';
import { VScholarDto } from 'src/app/core/to/VScholarDto';
import { ScholarService } from './services/scholar.service';
import { TimelineDialogComponent } from './timeline-dialog/timeline-dialog.component';

import ResizeObserver from 'resize-observer-polyfill';
import { MainService } from '../main/services/main.service';

@Component({
  selector: 'app-scholar',
  templateUrl: './scholar.component.html',
  styleUrls: ['./scholar.component.scss']
})
export class ScholarComponent implements OnInit {

  editar = false;
  saveRows: number [] = [];

  rowDataScholar : VScholarDto[] = [];

  provinces: string[] = [];

  defaultColDef : ColDef;

  gridOptions: GridOptions;

  api: GridApi = new GridApi;

  public dialogRef : TimelineDialogComponent | any;

  columnDefSch: ColDef[] = [
    { field: 'username', headerName: 'Username', cellStyle: {'background-color': '#F8F8F8'}, minWidth: 125, maxWidth: 140},
    { field: 'name', headerName: 'Nombre', cellStyle: {'background-color': '#F8F8F8'}, minWidth: 150, maxWidth: 200},
    { field: 'lastname', headerName: 'Apellidos', cellStyle: {'background-color': '#F8F8F8'}, minWidth: 150},
    { field: 'customer', headerName: 'Cliente', cellStyle: {'background-color': '#F8F8F8'}, minWidth: 150, maxWidth: 200},
    { field: 'hours', headerName: 'Horas', cellStyle: {'background-color': '#F8F8F8'}, minWidth: 80, maxWidth: 80},
    { field: 'manager', headerName: 'Responsable', editable: this.isEditing.bind(this),
      singleClickEdit: true, minWidth: 150, maxWidth: 200},
    { field: 'province', headerName: 'Localización', editable: this.isEditing.bind(this),
    singleClickEdit: true, cellEditor: 'agSelectCellEditor', minWidth: 150, maxWidth: 150,
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
    { field: 'startDate', headerName: 'Inicio', editable: this.isEditing.bind(this),
      singleClickEdit: true, cellEditorPopup: false, minWidth: 130, maxWidth: 150, comparator : this.dateComparator,
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
    { field: 'endDate', headerName: 'Fin', editable: this.isEditing.bind(this),
      singleClickEdit: true, cellEditorPopup: false, minWidth: 130, maxWidth: 150, comparator : this.dateComparator,
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
    { field: 'title', headerName: 'Titulación', editable: this.isEditing.bind(this),
      singleClickEdit: true, minWidth: 150, maxWidth: 175},
    { field: 'action', headerName: 'Acción', editable: this.isEditing.bind(this),
      singleClickEdit: true, minWidth: 125, maxWidth: 125,
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
    { field: 'active', headerName: 'Estado', cellStyle: {'background-color': '#F8F8F8'},
      minWidth: 125, maxWidth: 125, valueGetter: function (params) {
        if (params.data.active == 1) {
            return 'Activo';
        } else if (params.data.active == 0) {
            return 'Baja';
        } else {
            return 'Pendiente';
        }
      }
    },
  ];


  constructor( private scholarService: ScholarService, private mainService: MainService, public dialog: MatDialog)
  {
    this.defaultColDef = {
      sortable: true,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      filterParams: {
        filterOptions: ["contains","equals"],
        newRowsAction: 'keep',
        },
      floatingFilterComponentParams: {suppressFilterButton:true},
      suppressMenu:true
    };

    this.gridOptions = {
      getRowNodeId: (data) => data.id,
    };
  }

  ngOnInit(): void {
    this.getScholars();

    this.mainService.findProvince().subscribe((res) => {
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

  getScholars(){
    this.scholarService.findScholars().subscribe( (res) => {
      this.rowDataScholar = res;
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
        this.saveRows = [];
        this.getScholars();
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
    var scholarsChanged: VScholarDto[] = [];

    this.api.forEachNode(node => {
      if(this.saveRows.includes(node.data.id) || node.data.id == null) {
        scholarsChanged.push(node.data);
      }
    });
    this.scholarService.saveOrUpdateScholars(scholarsChanged).subscribe(data => {
      this.rowDataScholar = data;
    });


    this.api?.onFilterChanged();
    this.saveRows = [];
  }

  openTimeLine(){
    this.dialogRef = this.dialog.open(TimelineDialogComponent, {
      data: {},
      width: '80vw',
      height: '90vh'
    });
  }

  resizeGrid() {
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
