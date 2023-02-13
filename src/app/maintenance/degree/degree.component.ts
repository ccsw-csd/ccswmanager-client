import { Component, OnInit } from '@angular/core';
import { CellClickedEvent, ColDef, ColumnApi, GridApi, GridOptions} from 'ag-grid-community';
import { PersonDto } from 'src/app/core/to/PersonDto';
import ResizeObserver from 'resize-observer-polyfill';


@Component({
  selector: 'app-degree',
  templateUrl: './degree.component.html',
  styleUrls: ['./degree.component.scss']
})
export class DegreeComponent implements OnInit {

  gridOptions: GridOptions;
  api: GridApi = new GridApi;

  columnDefs: ColDef[];
  defaultColDef: ColDef;
  rowData : PersonDto[] = [];



  constructor() { 

    this.columnDefs = [
      { field: 'name', headerName: 'Nombre'},
      { field: 'delete', headerName:'Acciones', minWidth: 120, maxWidth: 120, floatingFilter: false, editable: false,
        cellRenderer: function(params) {
          return '<span><i class="material-icons" style="margin-top:10px; color: lightcoral;">clear</i></span>'
        },
        //onCellClicked: (event: CellClickedEvent) => this.delete(event), sortable:false, hide: true
      },

    ];

  }

  ngOnInit(): void {
  }


  addItem(): void {

  }

  resizeGrid(): void {
    this.api.sizeColumnsToFit();
  }

  firstDataRendered(): void {
    this.resizeGrid();
  }

  onGridReady = (params: { api: GridApi; columnApi: ColumnApi}) => {
    this.api = params.api;


    const sort = [
      {colId: 'lastname', sort: 'asc'}
    ];

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

}
