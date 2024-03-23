import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilsService } from '../shared/utility';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private util: UtilsService,
    private route: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const isTokenAvailable = this.util.getItemToLocalStorage('authToken');
      if (!isTokenAvailable) {
        return true;
      }
      if (this.util.getItemToLocalStorage('userType')) {
        const  userType = this.util.getItemToLocalStorage('userType');
        // for super admin only
        if (userType === 'user') {
          this.route.navigate(['/doctor/chemist']);
        } else {
          this.route.navigate(['/chemist/dashboard']);
        }
      }
    
      return false;
  }
  
}
