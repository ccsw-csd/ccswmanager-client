import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ResponseCredentials } from 'src/app/core/to/ResponseCredentials';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient,
    private authService: AuthService,) {}

  login(username: string, password: string): Observable<ResponseCredentials> {

    this.authService.clearCredentials();

    let urlSSO = 'http://ccsw.capgemini.com/sso';

    return this.http.post<ResponseCredentials>(urlSSO+'/authenticate', {username:username, password: password});
  }
  
  putCredentials(res: ResponseCredentials) {
    this.authService.putTokenCredentials(res);
  }
  
}

