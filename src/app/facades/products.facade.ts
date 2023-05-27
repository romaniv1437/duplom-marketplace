import { Injectable } from '@angular/core';
import {Store} from "@ngrx/store";
import {Product} from "../models/products.interface";
import {Observable} from "rxjs";
import {
  selectCartProductLength,
  selectCurrentProduct,
  selectProducts,
  selectProductsForHome,
  selectUserProducts
} from "../store/selectors";
import {addProductToCart, createProduct, loadProductById, loadProducts, loadUserProducts} from "../store/actions";
import {PaginationData} from "../models/core.interface";
import {CartProduct} from "../models/cart.interface";

@Injectable({
  providedIn: 'root',
})
export class ProductsFacade {

  public products$: Observable<Product[]> = new Observable<Product[]>()
  public userProducts$: Observable<Product[]> = new Observable<Product[]>()
  public product$: Observable<Product> = new Observable<Product>()
  public homePageProducts$: Observable<Product[]> = new Observable<Product[]>()

  constructor(private store$: Store) {
    this.products$ = this.store$.select(selectProducts)
    this.userProducts$ = this.store$.select(selectUserProducts)
    this.product$ = this.store$.select(selectCurrentProduct)
    this.homePageProducts$ = this.store$.select(selectProductsForHome)
  }

  public loadProducts(paginationData: PaginationData, category: string): void {
    this.store$.dispatch(loadProducts({paginationData, category}));
  }
  public loadProductById(productId: string): void {
    this.store$.dispatch(loadProductById({productId}));
  }
  public loadUserProducts(): void {
    this.store$.dispatch(loadUserProducts());
  }

  public createProduct(product: Product): void {
    this.store$.dispatch(createProduct({product}));
  }
}
