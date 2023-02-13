import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LevelDto } from 'src/app/core/to/LevelDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LevelService {

  constructor(
    private http: HttpClient,
  ) { }

  findAll() : Observable<LevelDto[]> {
    return this.http.get<LevelDto[]>(environment.server+ '/level/');
  }
}
