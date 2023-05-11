import { Injectable } from '@angular/core';
import {Store} from "@ngrx/store";
import {Product} from "../models/products.interface";
import {Observable} from "rxjs";
import {selectProducts, selectProductsForHome} from "../store/selectors";
import {loadProducts} from "../store/actions";
import {PaginationData} from "../models/core.interface";

@Injectable({
  providedIn: 'root',
})
export class ProductsFacade {

  public products$: Observable<Product[]> = new Observable<Product[]>()
  public homePageProducts$: Observable<Product[]> = new Observable<Product[]>()

  constructor(private store$: Store) {
    this.products$ = this.store$.select(selectProducts)
    this.homePageProducts$ = this.store$.select(selectProductsForHome)
  }

  public loadProducts(paginationData: PaginationData, category: string): void {
    this.store$.dispatch(loadProducts({paginationData, category}));
  }
}
