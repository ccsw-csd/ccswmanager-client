import { Component, OnInit} from '@angular/core';
import { Usuario } from '../core/to/Usuario';
import { UserService } from './users.service';
import { ColDef} from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { CustomCellButtonComponent } from './custom-cell-button/custom-cell-button.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  
  usuarios: Usuario[] = [];
  allUsername !: string[];
  defaultColDef !: ColDef;
  isloading !: boolean;
  editar = false;
  frameworkComponents: { btnCellRenderer: typeof CustomCellButtonComponent; };
  
  constructor( 
    private userService: UserService,
    public dialog: MatDialog
     ) {
      this.frameworkComponents = {
        btnCellRenderer: CustomCellButtonComponent
      }
    }

    columnDefSch: ColDef[] = 
    [
      { field: 'username', headerName: 'Nombre de usuario', sortable: true, cellStyle: {'background-color': '#F8F8F8'}},
      { field: 'name', headerName: 'Nombre', sortable: true, cellStyle: {'background-color': '#F8F8F8'}}, 
      { field: 'lastname', headerName: 'Apellidos', sortable: true, cellStyle: {'background-color': '#F8F8F8'}}, 
      { field: 'role', headerName: 'Rol', sortable: true, cellStyle: {'background-color': '#F8F8F8'}},
      { headerName: 'Acción', cellRenderer: 'btnCellRenderer', cellRendererParams: {
        onClick: this.onBtnClick.bind(this)
      },cellStyle: {'background-color': '#F8F8F8'}, filter : false}
    ]
        
  ngOnInit(): void {
    this.getUsuarios();
    
    this.defaultColDef = {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      filterParams: {
        filterOptions: ["contains"],
        newRowsAction: 'keep',
      },
      floatingFilterComponentParams: {suppressFilterButton:true},
      suppressMenu:true,
      singleClickEdit: true
    };
  }

  getUsuarios(): void {
    this.isloading = true;
    this.userService.findUsuario().subscribe({
      next: usuarios => {
        this.usuarios = usuarios;
        this.isloading = false;
      }
    });
  }

  addUser()
  {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUsuarios();
    });
  }
  
  onBtnClick(e : any)
  {
    this.getUsuarios();
  }


}
