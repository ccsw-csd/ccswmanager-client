import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PyramidTeamsDto } from 'src/app/core/to/PyramidTeamsDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PyramidTeamService {

  constructor(
    private http: HttpClient
  ) { }

  getPyramidIndexCost() : Observable<Map<String, Number>[]> {
    return this.http.get<Map<String, Number>[]>(environment.server+ '/pyramid/');
  }

  getTeamsCost() : Observable<PyramidTeamsDto[]> {
    return this.http.get<PyramidTeamsDto[]>(environment.server+ '/pyramid/team');
  }
}
