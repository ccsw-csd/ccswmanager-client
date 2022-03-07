import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScholarDto } from 'src/app/core/to/ScholarDto';
import { VScholarDto } from 'src/app/core/to/VScholarDto';
import { VScholarTimeLine } from 'src/app/core/to/VScholarTimeLine';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScholarService {

  constructor(
    private http: HttpClient,
  ) { }

  findScholars() : Observable<VScholarDto[]> {
    return this.http.get<VScholarDto[]>(environment.server+ '/scholar/');
  }
  
  saveOrUpdateScholars(scholar: VScholarDto[]) : Observable<VScholarDto[]> {
    return this.http.post<VScholarDto[]>(environment.server+ '/scholar/', scholar);
  }

  findScholarsByDateTimeline(startDate? : Date, endDate?: Date) : Observable<VScholarTimeLine[]> {
    let data = {
      startDate: startDate != null ? startDate : null, 
      endDate: endDate != null ? endDate : null
    };
    return this.http.post<VScholarTimeLine[]>(environment.server+ '/scholar/dateFilter', data);
  }
}
