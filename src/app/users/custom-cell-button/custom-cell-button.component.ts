import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { DialogComponent } from 'src/app/core/dialog/dialog.component';
import { Usuario } from 'src/app/core/to/Usuario';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { UserService } from '../users.service';

@Component({
  selector: 'app-custom-cell-button',
  templateUrl: './custom-cell-button.component.html',
  styleUrls: ['./custom-cell-button.component.scss']
})
export class CustomCellButtonComponent implements ICellRendererAngularComp {

  usuario !: Usuario;
  private params: any;

  constructor(public dialog: MatDialog,
    private userService: UserService) { }

  refresh(params: ICellRendererParams): boolean {

    throw new Error('Method not implemented.');
  }

  agInit(params: any): void {
    this.params = params;
  }

  onClickEdit() {
    this.usuario = this.params.node.data; 
    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: {user : this.usuario}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.params.onClick();
    });
  } 

  onClickClear() {
    this.usuario = this.params.node.data; 
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: "Atención", description: "Está a punto de borrar un usuario del sistema, este usuario perderá su acceso a la herramienta. "
     +"<br\>¿Está seguro que desea borrar el usuario " + "'"+ this.usuario.username + "'?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(this.usuario.username).subscribe(res =>{
          this.params.onClick();
        })
      }
    });
  } 

}
