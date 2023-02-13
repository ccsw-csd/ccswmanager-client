import ResizeObserver from 'resize-observer-polyfill';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellClickedEvent, ColDef, ColumnApi, GridApi, GridOptions} from 'ag-grid-community';
import { DialogComponent } from 'src/app/core/dialog/dialog.component';
import { AlertDialogComponent } from 'src/app/core/alert-dialog/alert-dialog.component';
import { TechnologyDto } from 'src/app/core/to/TechnologyDto';
import { TechnologyService } from 'src/app/core/services/technology.service';
import { TechnologyEditComponent } from './technology-edit/technology-edit.component';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.scss']
})
export class TechnologyComponent implements OnInit { 



  gridOptions: GridOptions;
  api: GridApi = new GridApi;

  columnDefs: ColDef[];
  defaultColDef: ColDef;
  rowData : TechnologyDto[] = [];

  constructor(
    private technologyService: TechnologyService,
    public dialog: MatDialog,
  ) { 

    let actionCellStyle = { 'padding-left': 0, 'padding-right': 0, 'text-align': 'center', 'cursor':'pointer'};

    this.columnDefs = [
      { field: 'name', headerName: 'Nombre'},
      { field: 'edit', headerName:'', minWidth: 40, maxWidth: 40, cellStyle: actionCellStyle, floatingFilter: false, editable: false,
        cellRenderer: function(params) {
          return '<span><i class="material-icons" style="margin-top:10px; color: #4d4f5c;">edit</i></span>'
        },
        onCellClicked: (event: CellClickedEvent) => this.editItem(event), sortable:false
      },
      { field: 'delete', headerName:'', minWidth: 40, maxWidth: 40, cellStyle: actionCellStyle, floatingFilter: false, editable: false,
        cellRenderer: function(params) {
          return '<span><i class="material-icons" style="margin-top:10px; color: #4d4f5c;">delete</i></span>'
        },
        onCellClicked: (event: CellClickedEvent) => this.deleteItem(event), sortable:false
      },

    ];

  }

  ngOnInit(): void {
    this.loadData();
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
      {colId: 'name', sort: 'asc'}
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



  loadData(): void {
    this.technologyService.findAll().subscribe((data) => {
      this.rowData = data;
    });
  }

  addItem(): void {
    this.editItem(null);
  }

  deleteItem(event: CellClickedEvent): void {
    var rowNode;
    if(event.node.id != undefined)
      rowNode = this.api.getRowNode(event.node.id);


    if (!rowNode || !rowNode.data || !rowNode.data.id) return;

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: { title: "Atención", description: "Vas a eliminar la tecnología '"+rowNode.data.name+"'.<br/>¿Estás seguro que deseas eliminar la tecnología?"}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.technologyService.delete(rowNode.data.id).subscribe({
          next: () => {
            this.loadData();
          },
          error: (err: any) => {
            this.dialog.open(AlertDialogComponent, {
              data: { titulo: "Error", informacion: "La tecnología está siendo usada por otro registro y no puede borrarse.<br/>Por favor actualice los registros que la utilizan para poder borrar la tecnología."}
            });

          }
        })
      }
    });
  }
  
  editItem(event: CellClickedEvent): void {
    var data;

    if(event != null && event.node.id != undefined) {
      let rowNode = this.api.getRowNode(event.node.id);

      if (rowNode && rowNode.data) data = rowNode.data;
    }

    const dialogRef = this.dialog.open(TechnologyEditComponent, {
      width: '700px',
      height: '250px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadData();
    })
  }
  

}
