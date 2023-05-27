import { Injectable } from '@angular/core';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import { loadCategories } from '../store/actions';
import {selectCategories, selectError} from "../store/selectors";
import {Category} from "../models/category.interface";

@Injectable({
  providedIn: 'root'
})
export class BaseFacade {
  public error$: Observable<string> = new Observable<string>();
  public categories$: Observable<Category[]> = new Observable<Category[]>();
  constructor(private store$: Store) {
    this.error$ = this.store$.select(selectError);
    this.categories$ = this.store$.select(selectCategories);
  }

  public loadCategories(): void {
    this.store$.dispatch(loadCategories());
  }
}
