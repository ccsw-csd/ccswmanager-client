import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../to/User';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserResolverService implements Resolve<any> {
  constructor(private http: HttpClient) { }

  /**
   * resolve method
   * @param route
   * @param state
   */
  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    return new Observable<User>();
    /*
    return this.http.get<User>(
        environment.server + '/user/'
    );
    */
  }

}