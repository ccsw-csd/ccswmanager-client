import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
}
