import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from '../core/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridApi, GridOptions, ValueFormatterParams, CellClassParams, FirstDataRenderedEvent, GridSizeChangedEvent} from 'ag-grid-community';
import * as moment from 'moment';
import ResizeObserver from 'resize-observer-polyfill';
import { PyramidService } from './services/pyramid.service';
import { ChartComponent } from "ng-apexcharts";
import { PyramidDto } from '../core/to/PyramidDto';

@Component({
  selector: 'app-pyramid',
  templateUrl: './pyramid.component.html',
  styleUrls: ['./pyramid.component.scss']
})
export class PyramidComponent implements OnInit {

  @ViewChild("chartLeft") chartLeft: ChartComponent | undefined;
  @ViewChild("chartRight") chartRight: ChartComponent | undefined;
  public chartOptionsLeft: Partial<any>;
  public chartOptionsRight: Partial<any>;

  editar = false;
  saveRows: number [] = [];

  rowDataPyramidMap : Map<String, Number>[] = [];
  rowDataPyramidChartLeft : PyramidDto[] = [];
  rowDataPyramidChartRight : PyramidDto[] = [];

  rowProfilePyramidGraphLeft : string[] = [];
  rowIndexPyramidGraphLeft : number[] = [];

  defaultColDef : ColDef;
  defaultColDefChartLeft : ColDef;
  defaultColDefChartRight : ColDef;

  gridOptions: GridOptions;
  gridOptionsLeft: GridOptions;
  gridOptionsRight: GridOptions;

  api: GridApi = new GridApi;
  apiLeft: GridApi = new GridApi;
  apiRight: GridApi = new GridApi;

  columnDefSch: ColDef[] = [
    { field: 'rowName', headerName: '', cellStyle: {'background-color': '#F8F8F8', "font-weight":"bold"}, minWidth: 80, maxWidth: 80,
      valueGetter: function (params) {
        if (params.data.rowName == 0)
          return "INDEX";
        else
          return "COST";
      }
    },
    { field: 'A1', headerName: 'A1', singleClickEdit: true, minWidth: 80, maxWidth: 100,
      cellStyle: this.cellStyleEditableBackground, editable: this.isEditing.bind(this), 
      valueFormatter: this.valueGetFormatDecimals,
    },
    { field: 'A2', headerName: 'A2', singleClickEdit: true, minWidth: 80, maxWidth: 100,
      cellStyle: this.cellStyleEditableBackground, editable: this.isEditing.bind(this), 
      valueFormatter: this.valueGetFormatDecimals,
    }, 
    { field: 'B1', headerName: 'B1', singleClickEdit: true, minWidth: 80, maxWidth: 100,
      cellStyle: this.cellStyleEditableBackground, editable: this.isEditing.bind(this), 
      valueFormatter: this.valueGetFormatDecimals,
    }, 
    { field: 'B2', headerName: 'B2', singleClickEdit: true, minWidth: 80, maxWidth: 100,
      cellStyle: this.cellStyleEditableBackground, editable: this.isEditing.bind(this), 
      valueFormatter: this.valueGetFormatDecimals,
    },
    { field: 'B3', headerName: 'B3', singleClickEdit: true, minWidth: 80, maxWidth: 100,
      cellStyle: this.cellStyleEditableBackground, editable: this.isEditing.bind(this), 
      valueFormatter: this.valueGetFormatDecimals,
    },
    { field: 'C1', headerName: 'C1', singleClickEdit: true, minWidth: 80, maxWidth: 100,
      cellStyle: this.cellStyleEditableBackground, editable: this.isEditing.bind(this), 
      valueFormatter: this.valueGetFormatDecimals,
    },
    { field: 'C2', headerName: 'C2', singleClickEdit: true, minWidth: 80, maxWidth: 100,
      cellStyle: this.cellStyleEditableBackground, editable: this.isEditing.bind(this), 
      valueFormatter: this.valueGetFormatDecimals,
    }, 
    { field: 'C3', headerName: 'C3', singleClickEdit: true, minWidth: 80, maxWidth: 100,
      cellStyle: this.cellStyleEditableBackground, editable: this.isEditing.bind(this), 
      valueFormatter: this.valueGetFormatDecimals,
    }, 
    { field: 'D1', headerName: 'D1', singleClickEdit: true, minWidth: 80, maxWidth: 100,
      cellStyle: this.cellStyleEditableBackground, editable: this.isEditing.bind(this), 
      valueFormatter: this.valueGetFormatDecimals,
    },
    { field: 'D2', headerName: 'D2', singleClickEdit: true, minWidth: 80, maxWidth: 100,
      cellStyle: this.cellStyleEditableBackground, editable: this.isEditing.bind(this), 
      valueFormatter: this.valueGetFormatDecimals,
    },
  ];

  columnDefSchChartLeft: ColDef[] = [
    { field: 'profile', headerName: 'PERFIL', cellStyle: {'background-color': '#F8F8F8'}, minWidth: 70, maxWidth: 100 },
    { field: 'count', headerName: 'COUNT', cellStyle: {'background-color': '#F8F8F8'}, minWidth: 70, maxWidth: 100 },
    { field: 'index', headerName: 'INDEX', cellStyle: {'background-color': '#F8F8F8'}, minWidth: 70, maxWidth: 100,
      valueFormatter: this.valueGetFormatDecimals
    }
  ];
  columnDefSchChartRight: ColDef[] = [
    { field: 'profile', headerName: 'PERFIL', cellStyle: {'background-color': '#F8F8F8'}, minWidth: 70, maxWidth: 100 },
    { field: 'count', headerName: 'COUNT', cellStyle: {'background-color': '#F8F8F8'}, minWidth: 70, maxWidth: 100 }
  ];

  constructor( private pyramidService: PyramidService, public dialog: MatDialog) 
  { 
    this.defaultColDef = {
      sortable: true,
      floatingFilterComponentParams: {suppressFilterButton:true},
      suppressMenu:true
    };

    this.defaultColDefChartLeft = {
      sortable: true,
      floatingFilterComponentParams: {suppressFilterButton:true},
      suppressMenu:true,
      resizable: true,
    };

    this.defaultColDefChartRight = {
      sortable: true,
      floatingFilterComponentParams: {suppressFilterButton:true},
      suppressMenu:true,
      resizable: true,
    };

    this.gridOptions = {
      getRowNodeId: (data) => data.id,
    };

    this.gridOptionsLeft = {
      getRowNodeId: (data) => data.id,
    };

    this.gridOptionsRight = {
      getRowNodeId: (data) => data.id,
    };
    
    this.chartOptionsLeft = {
      series: [
        {
          name: "index",
          data: []
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: []
      }
    };

    this.chartOptionsRight = {
      series: [
        {
          name: "index",
          data: []
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: []
      }
    };
  }

  ngOnInit(): void {
    this.getPyramidsIndexCosts();
    this.getPyramidsGridLeft();
    this.getPyramidsGridRight();
  }

  getPyramidsIndexCosts(){
    this.pyramidService.getPyramidIndexCost().subscribe( (res) => {
      this.rowDataPyramidMap = res;
    }); 
  }

  getPyramidsGridLeft(){
    this.pyramidService.getPyramidsProfileCountIndex().subscribe( (res) => {
      this.rowDataPyramidChartLeft = res;

      let resChart = res.filter(data => data.profile != 'TOTAL');
      this.chartOptionsLeft.series = [{
        name: "index",
        data: resChart.map((elem) => ({
          'x': elem.profile,
          'y': elem.index?.toFixed(2)
        }))
      }];
    }); 
  }

  getPyramidsGridRight(){
    this.pyramidService.getPyramidsProfileCount().subscribe( (res) => {
      this.rowDataPyramidChartRight = res;

      let resChart = res.filter(data => data.profile != 'TOTAL');
      this.chartOptionsRight.series = [{
        name: "count",
        data: resChart.map((elem) => ({
          'x': elem.profile,
          'y': elem.count
        }))
      }];
    }); 
  }
  
  onGridReady = (params: { api: GridApi;}) => {
    this.api = params.api;
    
    this.api.sizeColumnsToFit();
    let agGrid = document.getElementById('agGridPyramid');
    let obs = new ResizeObserver(entries => {
      for (let entry of entries) {
        this.api.sizeColumnsToFit();
      }
    });
    if(agGrid != null)
      obs.observe(agGrid);
  }

  onGridReadyLeft = (params: { api: GridApi;}) => {
    this.apiLeft = params.api;
    
    this.apiLeft.sizeColumnsToFit();
    let agGridLeft = document.getElementById('agGridChartLeft');
    let obs = new ResizeObserver(entries => {
      for (let entry of entries) {
        this.apiLeft.sizeColumnsToFit();
      }
    });
    if(agGridLeft != null)
      obs.observe(agGridLeft);
  }

  
  onGridReadyRight = (params: { api: GridApi;}) => {
    this.apiRight = params.api;
    
    this.apiRight.sizeColumnsToFit();
    let agGridRight = document.getElementById('agGridChartRight');
    let obs = new ResizeObserver(entries => {
      for (let entry of entries) {
        this.apiRight.sizeColumnsToFit();
      }
    });
    if(agGridRight != null)
      obs.observe(agGridRight);
  }


  isEditing(params: { data: { rowName: number; }; }){
    if(this.editar == true)
      return params.data.rowName == 1;
    else
      return false;
  }

  cellStyleEditableBackground(params: CellClassParams){
      if (params.data.rowName == 1) {
        return {backgroundColor: '#FFFFFF'};
      }
      return {backgroundColor: '#F8F8F8'};
  }

  valueGetFormatDecimals(params: ValueFormatterParams) {
    return (Math.round(params.value * 100) / 100).toFixed(2);
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
        this.getPyramidsIndexCosts();
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
    var pyramidCostsChanged: Map<String, Number>[] = [];
    this.api.forEachNode(node => {
      if(this.saveRows.includes(node.data.id) || node.data.id == null) {
        pyramidCostsChanged.push(node.data);
      }
    });

    this.pyramidService.saveOrUpdatePyramidCosts(pyramidCostsChanged).subscribe(data => {
      this.rowDataPyramidMap = data;
    });


    this.api?.onFilterChanged();
    this.saveRows = [];
  }
  
  resizeGrid() {
    this.api.sizeColumnsToFit();
  }

  resizeGridLeft() {
    this.apiLeft.sizeColumnsToFit();
    this.apiLeft.setDomLayout('autoHeight');
  }

  resizeGridRight() {
    this.apiRight.sizeColumnsToFit();
    this.apiRight.setDomLayout('autoHeight');
  }

  onGridSizeChanged(params: GridSizeChangedEvent) {
    var gridWidth = document.getElementById('left')!.offsetWidth;
    var columnsToShow = [];
    var columnsToHide = [];
    var totalColsWidth = 0;
    var allColumns = params.columnApi.getAllColumns();

    if (allColumns && allColumns.length > 0) {
      for (var i = 0; i < allColumns.length; i++) {
        var column = allColumns[i];
        totalColsWidth += column.getMinWidth() || 0;
        if (totalColsWidth > gridWidth) {
          columnsToHide.push(column.getColId());
        } else {
          columnsToShow.push(column.getColId());
        }
      }
    }

    params.columnApi.setColumnsVisible(columnsToShow, true);
    params.columnApi.setColumnsVisible(columnsToHide, false);
    params.api.sizeColumnsToFit();
  }
}
