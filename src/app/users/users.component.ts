import { Component, OnInit} from '@angular/core';
import { Usuario } from '../core/to/Usuario';
import { UserService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  errorMessage: string = "";
  usuarios: Usuario[] = [];

  constructor( private userService: UserService ) {
  }

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios(): void {
    this.userService.findUsuario().subscribe({
      next: usuarios => {
        this.usuarios = usuarios;  
        console.log(usuarios[0].id);
        console.log(usuarios[0].role);
        console.log(usuarios[0].name);
      }
      ,
      error: err => this.errorMessage = err,
  });
  }
}
