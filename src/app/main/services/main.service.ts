import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CenterDto } from 'src/app/core/to/CenterDto';
import { PersonDto } from 'src/app/core/to/PersonDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(
    private http: HttpClient,
  ) { }


  findPersons() : Observable<PersonDto[]> {
    return this.http.get<PersonDto[]>(environment.server+ '/person/');
  }

  saveOrUpdatePerson(person: PersonDto) : Observable<PersonDto> {
    return this.http.post<PersonDto>(environment.server+ '/person/', person);
  }

  findCenters(): Observable<CenterDto[]> {
    return this.http.get<CenterDto[]>(environment.server + '/center/');
  }
}
