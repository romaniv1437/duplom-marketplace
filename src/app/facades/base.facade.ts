import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {loadCategories} from '../store/actions';
import {selectCategories, selectError, selectIsLoading} from "../store/selectors";
import {Category} from "../models/category.interface";

@Injectable({
  providedIn: 'root'
})
export class BaseFacade {
  public error$: Observable<string> = new Observable<string>();
  public isLoading$: Observable<boolean> = new Observable<boolean>();
  public categories$: Observable<Category[]> = new Observable<Category[]>();

  constructor(private store$: Store) {
    this.error$ = this.store$.select(selectError);
    this.isLoading$ = this.store$.select(selectIsLoading);
    this.categories$ = this.store$.select(selectCategories);
  }

  public loadCategories(): void {
    this.store$.dispatch(loadCategories());
  }
}
