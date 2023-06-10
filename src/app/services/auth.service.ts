import {Injectable} from '@angular/core';
import {AuthFacade} from "../facades/auth.facade";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private authFacade: AuthFacade) {
  }

  public get isAuth(): boolean {
    if (!!localStorage.getItem('life_access')) {
      if (new Date().getTime() >= new Date(localStorage.getItem('life_access')!).getTime()) {
        console.error('token expired')
        this.authFacade.logout();
      }
    }

    return !!localStorage.getItem('accessToken');
  }

  public get token(): string {
    return localStorage.getItem('accessToken') || '';
  }

  public setToken(token: { access: string, refresh: string, life_access: string }): void {
    localStorage.setItem('accessToken', token.access)
    localStorage.setItem('refreshToken', token.refresh)
    localStorage.setItem('life_access', token.life_access)
  }

  public clearToken(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('life_access');
  }
}
