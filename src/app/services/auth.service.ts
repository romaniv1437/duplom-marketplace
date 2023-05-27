import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  public setToken(token: { access: string, refresh: string }): void {
    localStorage.setItem('accessToken', token.access)
    localStorage.setItem('refreshToken', token.refresh)
  }

  public clearToken(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  public get isAuth(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  public get token(): string {
    return localStorage.getItem('accessToken') || '';
  }
}
