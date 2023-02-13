import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TechnologyDto } from 'src/app/core/to/TechnologyDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {

  constructor(
    private http: HttpClient,
  ) { }

  findAll() : Observable<TechnologyDto[]> {
    return this.http.get<TechnologyDto[]>(environment.server+ '/technology/');
  }
}
