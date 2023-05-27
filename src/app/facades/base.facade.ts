import { Injectable } from '@angular/core';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {selectError} from "../store/selectors";

@Injectable({
  providedIn: 'root'
})
export class BaseFacade {
  public error$: Observable<string> = new Observable<string>()
  constructor(private store$: Store) {
    this.error$ = this.store$.select(selectError);
  }
}
