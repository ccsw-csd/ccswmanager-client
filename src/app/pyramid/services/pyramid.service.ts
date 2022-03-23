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

  returnPyramidIndexCost() : Observable<PyramidDto[]> {
    return this.http.get<PyramidDto[]>(environment.server+ '/pyramid/');
  }

  saveOrUpdatePyramidCosts(pyramid: PyramidDto[]) : Observable<PyramidDto[]> {
    return this.http.post<PyramidDto[]>(environment.server+ '/pyramid/', pyramid);
  }
}
