import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { DefaultRoutes } from 'src/app/app-routing.module';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  
  constructor(public auth: AuthService, public router: Router) {
  }
  

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (this.auth.isTokenValid() == false) {
      this.auth.logout();
      return false;
    }
    
    return true;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if (this.canActivate(route, state) == false) return false;

    
    
    let isValid = this.validateRoute(route);
    if (isValid) return true;


    let validRoutes = DefaultRoutes.filter(item => {
      return this.auth.hasRole(item.role);
    });
    
    if (validRoutes && validRoutes.length > 0) {
      this.router.navigate([validRoutes[0].path]);
      return true;
    }
    else {
      this.auth.logout();
      return false;
    }

  }

  validateRoute(route: ActivatedRouteSnapshot) : boolean {
    if (!route.data || !route.data.role) return true;

    for (let role of route.data.role) {
      if (this.auth.hasRole(role)) return true;
    };

    return false;
  }

}