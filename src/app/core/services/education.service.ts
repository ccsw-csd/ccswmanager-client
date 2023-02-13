import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EducationDto } from 'src/app/core/to/EducationDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EducationService {
  
  constructor(
    private http: HttpClient,
    ) { }
    
    findAll() : Observable<EducationDto[]> {
      return this.http.get<EducationDto[]>(environment.server+ '/education/');
    }
    
    
    save(data: EducationDto) : Observable<EducationDto> {
      return this.http.post<EducationDto>(environment.server+ '/education/', {id: data.id, name: data.name});
    }
    
    delete(id: number) : Observable<void> {
      return this.http.delete<void>(environment.server+ '/education/'+id);
      
    }
}
