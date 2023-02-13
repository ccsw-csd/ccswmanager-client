import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InternDto } from 'src/app/core/to/InternDto';
import { TimeLine } from 'src/app/core/to/TimeLine';

@Injectable({
  providedIn: 'root'
})
export class InternService {

  constructor(
    private http: HttpClient,
  ) { }

  findInterns() : Observable<InternDto[]> {
    return this.http.get<InternDto[]>(environment.server + '/intern/');
  }
  
  saveOrUpdateInterns(interns: InternDto[]) : Observable<InternDto[]> {
    return this.http.post<InternDto[]>(environment.server + '/intern/bulk', interns);
  }

  findInternsTimelineByDate(startDate? : Date, endDate?: Date) : Observable<TimeLine[]> {
    let data = {
      startDate: startDate != null ? startDate : null, 
      endDate: endDate != null ? endDate : null
    };
    return this.http.post<TimeLine[]>(environment.server+ '/intern/dateFilter', data);
  }

}
