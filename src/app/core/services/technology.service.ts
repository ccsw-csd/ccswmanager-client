import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TechnologyDto } from 'src/app/core/to/TechnologyDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {

  constructor(
    private http: HttpClient,
  ) { }

  findAll() : Observable<TechnologyDto[]> {
    return this.http.get<TechnologyDto[]>(environment.server+ '/technology/');
  }

  save(data: TechnologyDto) : Observable<TechnologyDto> {
    return this.http.post<TechnologyDto>(environment.server+ '/technology/', {id: data.id, name: data.name});
  }
  
  delete(id: number) : Observable<void> {
    return this.http.delete<void>(environment.server+ '/technology/'+id);
    
  }    
}
