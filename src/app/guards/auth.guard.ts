import {CanActivate, Router, UrlTree} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {AuthFacade} from "../facades/auth.facade";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private authFacade: AuthFacade,
    private router: Router) {
  }

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.isAuth) {
      return true;
    } else {
      this.authFacade.logout();
      this.authService.clearToken();
      this.router.navigateByUrl('/authorization').then(r => r);
      return false;
    }
  }
}
