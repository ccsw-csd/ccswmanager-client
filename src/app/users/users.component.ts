import { Component, OnInit} from '@angular/core';
import { Usuario } from '../core/to/Usuario';
import { UserService } from './users.service';
import { ColDef, GridApi, GridOptions} from 'ag-grid-community';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  usuarios: Usuario[] = [];
  defaultColDef !: ColDef;
  isloading !: boolean;

  columnDefSch: ColDef[] = 
  [
    { field: 'username', headerName: 'Nombre de usuario', sortable: true, cellStyle: {'background-color': '#F8F8F8'}},
    { field: 'name', headerName: 'Nombre', sortable: true, cellStyle: {'background-color': '#F8F8F8'}}, 
    { field: 'lastname', headerName: 'Apellidos', sortable: true, cellStyle: {'background-color': '#F8F8F8'}}, 
    { field: 'role', headerName: 'Rol', sortable: true, cellStyle: {'background-color': '#F8F8F8'}},
  ]

  constructor( private userService: UserService ) {
  }

  ngOnInit(): void {
    this.getUsuarios();
    
    this.defaultColDef = {
      sortable: true,
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
}
