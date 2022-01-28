import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScholarDto } from 'src/app/core/to/ScholarDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScholarService {

  constructor(
    private http: HttpClient,
  ) { }

  findScholars() : Observable<ScholarDto[]> {
    return this.http.get<ScholarDto[]>(environment.server+ '/scholar/');
  }

}
