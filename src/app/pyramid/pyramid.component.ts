import { Component, OnInit } from '@angular/core';
import { DialogComponent } from '../core/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridApi, GridOptions} from 'ag-grid-community';
import * as moment from 'moment';
import ResizeObserver from 'resize-observer-polyfill';
import { PyramidDto } from '../core/to/PyramidDto';
import { PyramidService } from './services/pyramid.service';

@Component({
  selector: 'app-pyramid',
  templateUrl: './pyramid.component.html',
  styleUrls: ['./pyramid.component.scss']
})
export class PyramidComponent implements OnInit {

  editar = false;
  saveRows: number [] = [];

  rowDataPyramid : PyramidDto[] = [];

  defaultColDef : ColDef;

  gridOptions: GridOptions;

  api: GridApi = new GridApi;

  columnDefSch: ColDef[] = [
    { field: 'rowName', headerName: '', cellStyle: {'background-color': '#F8F8F8', "font-weight":"bold"}, minWidth: 80, maxWidth: 80},
    { field: 'valueA1', headerName: 'A1', singleClickEdit: true, minWidth: 80, maxWidth: 100,
      cellStyle: params => {
        if (params.data.rowName == "COST") {
          return {backgroundColor: '#FFFFFF'};
        }
        return {backgroundColor: '#F8F8F8'};
      },
      editable: this.isEditing.bind(this), 
      valueGetter: function (params) {
        return (Math.round(params.data.valueA1 * 100) / 100).toFixed(2);
      }
    },
    { field: 'valueA2', headerName: 'A2', singleClickEdit: true, minWidth: 80, maxWidth: 100,
      cellStyle: params => {
        if (params.data.rowName == "COST") {
          return {backgroundColor: '#FFFFFF'};
        }
        return {backgroundColor: '#F8F8F8'};
      },
      editable: this.isEditing.bind(this), 
      valueGetter: function (params) {
        return (Math.round(params.data.valueA2 * 100) / 100).toFixed(2);
      }
    }, 
    { field: 'valueB1', headerName: 'B1', singleClickEdit: true, minWidth: 80, maxWidth: 100,
      cellStyle: params => {
        if (params.data.rowName == "COST") {
          return {backgroundColor: '#FFFFFF'};
        }
        return {backgroundColor: '#F8F8F8'};
      },  
      editable: this.isEditing.bind(this), 
      valueGetter: function (params) {
        return (Math.round(params.data.valueB1 * 100) / 100).toFixed(2);
      }
    }, 
    { field: 'valueB2', headerName: 'B2', singleClickEdit: true, minWidth: 80, maxWidth: 100,
      cellStyle: params => {
        if (params.data.rowName == "COST") {
          return {backgroundColor: '#FFFFFF', "font-weight":"bold"};
        }
        return {backgroundColor: '#F8F8F8', "font-weight":"bold"};
      },
      editable: this.isEditing.bind(this), 
      valueGetter: function (params) {
        return (Math.round(params.data.valueB2 * 100) / 100).toFixed(2);
      }
    },
    { field: 'valueB3', headerName: 'B3', singleClickEdit: true, minWidth: 80, maxWidth: 100,
      cellStyle: params => {
        if (params.data.rowName == "COST") {
          return {backgroundColor: '#FFFFFF'};
        }
        return {backgroundColor: '#F8F8F8'};
      },
      editable: this.isEditing.bind(this), 
      valueGetter: function (params) {
        return (Math.round(params.data.valueB3 * 100) / 100).toFixed(2);
      }
    },
    { field: 'valueC1', headerName: 'C1', singleClickEdit: true, minWidth: 80, maxWidth: 100,
      cellStyle: params => {
        if (params.data.rowName == "COST") {
          return {backgroundColor: '#FFFFFF'};
        }
        return {backgroundColor: '#F8F8F8'};
      },
      editable: this.isEditing.bind(this), 
      valueGetter: function (params) {
        return (Math.round(params.data.valueC1 * 100) / 100).toFixed(2);
      }
    },
    { field: 'valueC2', headerName: 'C2', singleClickEdit: true, minWidth: 80, maxWidth: 100,
      cellStyle: params => {
        if (params.data.rowName == "COST") {
          return {backgroundColor: '#FFFFFF'};
        }
        return {backgroundColor: '#F8F8F8'};
      },
      editable: this.isEditing.bind(this), 
      valueGetter: function (params) {
        return (Math.round(params.data.valueC2 * 100) / 100).toFixed(2);
      }
    }, 
    { field: 'valueC3', headerName: 'C3', singleClickEdit: true, minWidth: 80, maxWidth: 100,
      cellStyle: params => {
        if (params.data.rowName == "COST") {
          return {backgroundColor: '#FFFFFF'};
        }
        return {backgroundColor: '#F8F8F8'};
      },
      editable: this.isEditing.bind(this), 
      valueGetter: function (params) {
        return (Math.round(params.data.valueC3 * 100) / 100).toFixed(2);
      }
    }, 
    { field: 'valueD1', headerName: 'D1', singleClickEdit: true, minWidth: 80, maxWidth: 100,
      cellStyle: params => {
        if (params.data.rowName == "COST") {
          return {backgroundColor: '#FFFFFF'};
        }
        return {backgroundColor: '#F8F8F8'};
      },
      editable: this.isEditing.bind(this), 
      valueGetter: function (params) {
        return (Math.round(params.data.valueD1 * 100) / 100).toFixed(2);
      }
    },
    { field: 'valueD2', headerName: 'D2', singleClickEdit: true, minWidth: 80, maxWidth: 100,
      cellStyle: params => {
        if (params.data.rowName == "COST") {
          return {backgroundColor: '#FFFFFF'};
        }
        return {backgroundColor: '#F8F8F8'};
      },
      editable: this.isEditing.bind(this), 
      valueGetter: function (params) {
        return (Math.round(params.data.valueD2 * 100) / 100).toFixed(2);
      }
    },
  ];


  constructor( private pyramidService: PyramidService, public dialog: MatDialog) 
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
    this.getPyramidsIndexCosts();
  }

  getPyramidsIndexCosts(){
    this.pyramidService.returnPyramidIndexCost().subscribe( (res) => {
      this.rowDataPyramid = res;
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


  isEditing(params: { data: { rowName: string; }; }){
    if(this.editar == true)
      return params.data.rowName == "COST";
    else
      return false;
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
    var pyramidCostsChanged: PyramidDto[] = [];
    this.api.forEachNode(node => {
      if(this.saveRows.includes(node.data.id) || node.data.id == null) {
        pyramidCostsChanged.push(node.data);
      }
    });
    this.pyramidService.saveOrUpdatePyramidCosts(pyramidCostsChanged).subscribe(data => {
      this.rowDataPyramid = data;
    });


    this.api?.onFilterChanged();
    this.saveRows = [];
  }
  
  resizeGrid() {
    this.api.sizeColumnsToFit();
  }
}
