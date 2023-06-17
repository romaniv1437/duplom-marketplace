import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {User} from '../models/user.interface';
import {
  changePassword,
  deleteProfilePicture,
  editProfile,
  getUserInfo,
  getUserInfoByUserName,
  login,
  logout,
  register, setUserRating
} from '../store/actions';
import {selectProfile, selectUser} from "../store/selectors";

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  public user$: Observable<User> = new Observable<User>();
  public profile$: Observable<User> = new Observable<User>();

  constructor(private store$: Store) {
    this.user$ = this.store$.select(selectUser);
    this.profile$ = this.store$.select(selectProfile);
  }

  login(email: string, password: string): void {
    this.store$.dispatch(login({email, password}))
  }

  logout(): void {
    this.store$.dispatch(logout())
  }

  register(user: User, password: string, confirmPassword: string): void {
    this.store$.dispatch(register({user, password, confirmPassword}))
  }

  getUser(): void {
    this.store$.dispatch(getUserInfo())
  }
  getUserByUsername(username: string): void {
    this.store$.dispatch(getUserInfoByUserName({username}))
  }

  edit(user: User): void {
    this.store$.dispatch(editProfile({user}))
  }

  deleteProfilePicture(username: string): void {
    this.store$.dispatch(deleteProfilePicture({username}))
  }

  changePassword(passwords: {oldPassword: string; newPassword: string, confirmPassword: string}): void {
    this.store$.dispatch(changePassword({...passwords}))
  }

  setRating(username: string, rating: number): void {
    this.store$.dispatch(setUserRating({username, rating}))
  }
}
