import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonDto } from 'src/app/core/to/PersonDto';
import { ScholarDto } from 'src/app/core/to/ScholarDto';
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
  //
  findScholars() : Observable<ScholarDto[]> {
    return this.http.get<ScholarDto[]>(environment.server+ '/scholar/');
  }
  //
}
