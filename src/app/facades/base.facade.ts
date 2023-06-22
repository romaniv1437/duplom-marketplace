import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {clearState, loadCategories, loadCurrencies} from '../store/actions';
import {selectCategories, selectCurrencies, selectError, selectIsLoading} from "../store/selectors";
import {Category, Currency} from "../models/category.interface";

@Injectable({
  providedIn: 'root'
})
export class BaseFacade {
  public error$: Observable<string> = new Observable<string>();
  public isLoading$: Observable<boolean> = new Observable<boolean>();
  public categories$: Observable<Category[]> = new Observable<Category[]>();
  public currencies$: Observable<Currency[]> = new Observable<Currency[]>();

  constructor(private store$: Store) {
    this.error$ = this.store$.select(selectError);
    this.isLoading$ = this.store$.select(selectIsLoading);
    this.categories$ = this.store$.select(selectCategories);
    this.currencies$ = this.store$.select(selectCurrencies);
  }

  public loadCategories(): void {
    this.store$.dispatch(loadCategories());
  }
  public loadCurrencies(): void {
    this.store$.dispatch(loadCurrencies());
  }  public clearState(): void {
    this.store$.dispatch(clearState());
  }
}
