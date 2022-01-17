import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ResponseCredentials } from '../to/ResponseCredentials';
import { User } from '../to/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  credentials : ResponseCredentials | undefined;
  token : string | null = null;
  user: User | null = null;

  constructor(
    private jwtHelper: JwtHelperService,
    private router: Router,
  ) { }


  putTokenCredentials(res: ResponseCredentials) : void {
    localStorage.setItem('credentials', JSON.stringify(res));
  }

  putUserInfo(user: User) {
    this.user = user;
  }

  getTokenCredentials() : ResponseCredentials | null {
    
    if (this.credentials == undefined) {
      let json = localStorage.getItem('credentials');

      if (json != null)
        this.credentials = JSON.parse(json);
    }

    if (this.credentials == undefined) return null;
    
    return this.credentials;
  }

  getToken(): string | null {

    if (this.token == null) {
      let credentials = this.getTokenCredentials();
      if (credentials != null) {
        this.token = credentials.accessToken;
      }
    }

    return this.token;
  }

  public logout() {
    this.clearCredentials()
    this.router.navigateByUrl('login');
  }

  clearCredentials() {
    localStorage.removeItem('credentials');

    this.credentials = undefined;    
    this.token = null;
    this.user = null;
  }

  getUsername() : string | null {
    if (this.user == null) return null;
    return this.user.username;
  }

  isAdmin() : boolean {
    if (this.user == null || this.user.role == null) return false;
    return this.user.role == 'ADMIN';
  }


  isTokenValid() : boolean {
    let accessToken = this.getToken();
    if (accessToken == null) return false;

    return !this.jwtHelper.isTokenExpired(accessToken);
  }

  getUserInfo() : User | null {
    return this.user;
  }
}
