import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PyramidDto } from 'src/app/core/to/PyramidDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PyramidService {

  constructor(
    private http: HttpClient
  ) { }

  getPyramidIndexCost() : Observable<Map<String, Number>[]> {
    return this.http.get<Map<String, Number>[]>(environment.server+ '/pyramid/');
  }

  saveOrUpdatePyramidCosts(pyramid: Map<String, Number>[]) : Observable<Map<String, Number>[]> {
    return this.http.post<Map<String, Number>[]>(environment.server+ '/pyramid/', pyramid);
  }

  getPyramidsProfileCountIndex() : Observable<PyramidDto[]> {
    return this.http.get<PyramidDto[]>(environment.server+ '/pyramid/profileCountIndexGraph');
  }  

  getPyramidsProfileCount() : Observable<PyramidDto[]> {
    return this.http.get<PyramidDto[]>(environment.server+ '/pyramid/profileCountGraph');
  }
}
