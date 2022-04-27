import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellClassParams, ColDef, GridApi, GridOptions, GridSizeChangedEvent, HeaderClassParams, ValueFormatterParams } from 'ag-grid-community';
import ResizeObserver from 'resize-observer-polyfill';
import * as ApexCharts from 'apexcharts';
import { PyramidTeamsDto } from '../core/to/PyramidTeamsDto';
import { PyramidTeamService } from './services/pyramid-team.service';

@Component({
  selector: 'app-pyramid-team',
  templateUrl: './pyramid-team.component.html',
  styleUrls: ['./pyramid-team.component.scss']
})
export class PyramidTeamComponent implements OnInit,AfterViewInit {

  @ViewChildren('chart') chartComponents : QueryList<ElementRef> | any;


  rowDataPyramidMap : Map<String, Number>[] = [];

  dataRow: number [] = [];
  profileRow: string [] = [];
  rowTeams : PyramidTeamsDto [] = [];

  public chartOptions: Partial<any> | any;

  chartMap : Map<String, any> | any;
  defaultColDef : ColDef;
  gridOptions: GridOptions;
  api: GridApi = new GridApi;

  ngAfterViewInit(): void {
    this.chartComponents.changes
        .subscribe((componente: QueryList<ElementRef>) => {
          componente.forEach((element: ElementRef) => {
              var chart = new ApexCharts(element.nativeElement, this.chartMap.get(element.nativeElement.id));
              chart.render();
          });
        }
    );
  }

  columnDefSchGroup : ColDef[] = [
    { field: 'profile', headerName: 'PERFIL', headerClass: "ag-right-aligned-header",
    cellStyle: {'background-color': '#F8F8F8', "font-weight":"bold", 'text-align': 'right'}, minWidth: 40 },
    { field: 'count', headerName: 'COUNT', singleClickEdit: false, minWidth: 40,headerClass: "ag-right-aligned-header",
    valueFormatter: this.valueGetFormatInteger,cellStyle: this.cellStyleRight,},
    { field: 'index', headerName: 'INDEX', singleClickEdit: false, minWidth: 40,headerClass: "ag-right-aligned-header",
    valueFormatter: this.valueGetFormatDecimals,cellStyle: this.cellStyleRight,},
  ];

  columnDefSch: ColDef[] = [
    { field: 'rowName', headerName: '', headerClass: "ag-right-aligned-header",  cellStyle: {'background-color': '#F8F8F8', "font-weight":"bold", "text-align" : "right"}, minWidth: 80, maxWidth: 80,
      valueGetter: function (params) {
        if (params.data.rowName == 0)
          return "INDEX";
        else
          return "COST";
      }
    },
    { field: 'A1', headerName: 'A1',  singleClickEdit: true, minWidth: 75,headerClass: "ag-right-aligned-header",
      valueFormatter: this.valueGetFormatDecimals,cellStyle: this.cellStyleRight,
    },
    { field: 'A2', headerName: 'A2', singleClickEdit: true, minWidth: 75,headerClass: "ag-right-aligned-header",
      valueFormatter: this.valueGetFormatDecimals,cellStyle: this.cellStyleRight,
    },
    { field: 'B1', headerName: 'B1', singleClickEdit: true, minWidth: 75,headerClass: "ag-right-aligned-header",
      valueFormatter: this.valueGetFormatDecimals,cellStyle: this.cellStyleRight,
    },
    { field: 'B2', headerName: 'B2', singleClickEdit: true, minWidth: 75,headerClass: "ag-right-aligned-header",
      valueFormatter: this.valueGetFormatDecimals,cellStyle: this.cellStyleRight,
    },
    { field: 'B3', headerName: 'B3', singleClickEdit: true, minWidth: 75,
      valueFormatter: this.valueGetFormatDecimals,cellStyle: this.cellStyleRight, headerClass: "ag-right-aligned-header",
    },
    { field: 'C1', headerName: 'C1', singleClickEdit: true, minWidth: 75,
      valueFormatter: this.valueGetFormatDecimals,cellStyle: this.cellStyleRight, headerClass: "ag-right-aligned-header",
    },
    { field: 'C2', headerName: 'C2', singleClickEdit: true, minWidth: 75,
      valueFormatter: this.valueGetFormatDecimals,cellStyle: this.cellStyleRight, headerClass: "ag-right-aligned-header",
    },
    { field: 'C3', headerName: 'C3', singleClickEdit: true, minWidth: 75,
      valueFormatter: this.valueGetFormatDecimals,cellStyle: this.cellStyleRight, headerClass: "ag-right-aligned-header",
    },
    { field: 'D1', headerName: 'D1', singleClickEdit: true, minWidth: 75,
      valueFormatter: this.valueGetFormatDecimals,cellStyle: this.cellStyleRight, headerClass: "ag-right-aligned-header",
    },
    { field: 'D2', headerName: 'D2', singleClickEdit: true, minWidth: 75,
      valueFormatter: this.valueGetFormatDecimals,cellStyle: this.cellStyleRight, headerClass: "ag-right-aligned-header",
    },
  ];

  constructor( private pyramidTeamService: PyramidTeamService, public dialog: MatDialog){
    this.defaultColDef = {
      sortable: true,
      floatingFilterComponentParams: {suppressFilterButton:true},
      suppressMenu:true
    };

    this.gridOptions = {
      getRowNodeId: (data) => data.id,
    };

    this.chartMap = new Map();
  }

  ngOnInit(): void {
    this.getPyramidsIndexCosts();
    this.getPyramidTeams();
  }

  getPyramidsIndexCosts(){
    this.pyramidTeamService.getPyramidIndexCost().subscribe( (res) => {
      this.rowDataPyramidMap = res;
    });
  }

  getPyramidTeams(){
    this.pyramidTeamService.getTeamsCost().subscribe( (res) => {
      this.rowTeams = res;
      this.getCustomerData();
    });
  }

  onGridReady = (params: { api: GridApi;}) => {
    this.api = params.api;

    this.api.sizeColumnsToFit();
    let agGrid = document.getElementById('agGridPyramidTotal');
    let obs = new ResizeObserver(entries => {
      for (let entry of entries) {
        this.api.sizeColumnsToFit();
      }
    });
    if(agGrid != null)
      obs.observe(agGrid);
  }

  valueGetFormatDecimals(params: ValueFormatterParams) {
    return (Math.round(params.value * 100) / 100).toFixed(2);
  }

  valueGetFormatInteger(params: ValueFormatterParams) {
    return (Math.round(params.value * 100) / 100).toFixed(0);
  }

  resizeGrid() {
    this.api.sizeColumnsToFit();
  }

  onGridSizeChanged(params: GridSizeChangedEvent) {
    var gridWidth = document.getElementById('agGridPyramidGroup')!.offsetWidth;
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

  cellStyleRight(params: CellClassParams){
    return {
      backgroundColor: '#F8F8F8',
      textAlign: 'right'
    };
  }

  getCustomerData(){
    this.rowTeams.forEach(e => this.createCharts(e.customerName, e.customerList));
  }

  createCharts(title : string,  dataR : any) {
    this.dataRow = [];
    this.profileRow = [];

    dataR.forEach((v : any)=>
    {
      this.dataRow.push(v.index.toFixed(2));
      this.profileRow.push(v.profile);
    });
    this.dataRow.pop();
    this.profileRow.pop();

		var chartPyramid = {
      series: [
        {
          data: this.dataRow
        }
      ],
      chart: {
        type: "bar",
        height: 400,

      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: true
      },
      xaxis: {
        categories: this.profileRow
      }
    };

    this.chartMap.set(title, chartPyramid);
  }
}
