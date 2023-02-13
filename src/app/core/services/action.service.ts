import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionDto } from 'src/app/core/to/ActionDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  constructor(
    private http: HttpClient,
  ) { }

  findAll() : Observable<ActionDto[]> {
    return this.http.get<ActionDto[]>(environment.server+ '/action/');
  }
}
