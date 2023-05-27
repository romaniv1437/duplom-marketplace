import { Injectable } from '@angular/core';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import { User } from '../models/user.interface';
import {login, logout, register} from '../store/actions';
import {selectUser} from "../store/selectors";

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  public user$: Observable<User> = new Observable<User>();
  constructor(private store$: Store) {
    this.user$ = this.store$.select(selectUser);
  }

  login(email: string, password: string): void {
    this.store$.dispatch(login({email, password}))
  }

  logout(): void {
    this.store$.dispatch(logout())
  }
  register(user: User, password: string): void {
    this.store$.dispatch(register({user, password}))
  }
}
