import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScholarDto } from 'src/app/core/to/ScholarDto';
import { VScholarDto } from 'src/app/core/to/VScholarDto';
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
}
