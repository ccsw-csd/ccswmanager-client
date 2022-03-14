import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/core/to/Usuario';
import { environment } from 'src/environments/environment';
import { User } from '../core/to/User';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) { }

  findUsuario() : Observable<Usuario[]> {
    return this.http.get<Usuario[]>(environment.server+ '/user/');
  }

  saveUser(useruario : Usuario) : Observable<any>{

    return this.http.put(environment.server+ '/user/save', useruario)
  }


  deleteUser(id : number) : Observable<any>
  {
    return this.http.delete(environment.server + '/user/' + id );
  }
}
