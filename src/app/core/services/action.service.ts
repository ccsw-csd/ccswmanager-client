import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionDto } from 'src/app/core/to/ActionDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  constructor(
    private http: HttpClient,
  ) { }

  findAll() : Observable<ActionDto[]> {
    return this.http.get<ActionDto[]>(environment.server+ '/action/');
  }

  save(data: ActionDto) : Observable<ActionDto> {
    return this.http.post<ActionDto>(environment.server+ '/action/', {id: data.id, name: data.name});
  }
  
  delete(id: number) : Observable<void> {
    return this.http.delete<void>(environment.server+ '/action/'+id);
    
  }  

}
