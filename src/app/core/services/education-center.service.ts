import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EducationCenterDto } from 'src/app/core/to/EducationCenterDto';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EducationCenterService {

  constructor(
    private http: HttpClient,
  ) { }

  findAll() : Observable<EducationCenterDto[]> {
    return this.http.get<EducationCenterDto[]>(environment.server+ '/educationCenter/');
  }

  save(data: EducationCenterDto) : Observable<EducationCenterDto> {
    return this.http.post<EducationCenterDto>(environment.server+ '/educationCenter/', {id: data.id, name: data.name, type: data.type, province: data.province});
  }
  
  delete(id: number) : Observable<void> {
    return this.http.delete<void>(environment.server+ '/educationCenter/'+id);
    
  }  
}
