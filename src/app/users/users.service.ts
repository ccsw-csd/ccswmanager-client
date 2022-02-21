import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/core/to/Usuario';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) { }


  findUsuario() : Observable<Usuario[]> {
    return this.http.get<Usuario[]>(environment.server+ '/usuario/');
  }
}
