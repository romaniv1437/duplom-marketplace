import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Product, ProductsModel} from "../models/products.interface";
import {Observable} from "rxjs";
import {
  selectCurrentProduct, selectProducts,
  selectProductsForHome, selectProfileProducts, selectUserProducts,
} from "../store/selectors";
import {
  createProduct,
  deleteProduct,
  editProduct,
  loadProductById,
  loadProducts,
  loadUserProducts
} from "../store/actions";
import {PaginationData} from "../models/core.interface";

@Injectable({
  providedIn: 'root',
})
export class ProductsFacade {

  public products$: Observable<Product[]> = new Observable<Product[]>()
  public userProducts$: Observable<Product[]> = new Observable<Product[]>()
  public profileProducts$: Observable<Product[]> = new Observable<Product[]>()
  public product$: Observable<Product> = new Observable<Product>()
  public homePageProducts$: Observable<Product[]> = new Observable<Product[]>()

  constructor(private store$: Store) {
    this.products$ = this.store$.select(selectProducts)
    this.userProducts$ = this.store$.select(selectUserProducts)
    this.profileProducts$ = this.store$.select(selectProfileProducts)

    this.product$ = this.store$.select(selectCurrentProduct)
    this.homePageProducts$ = this.store$.select(selectProductsForHome)
  }

  public loadProducts(paginationData: PaginationData): void {
    this.store$.dispatch(loadProducts({paginationData}));
  }

  public loadProductById(productId: string): void {
    this.store$.dispatch(loadProductById({productId}));
  }

  public loadUserProducts(paginationData: PaginationData): void {
    this.store$.dispatch(loadUserProducts({paginationData}));
  }

  public createProduct(product: Product): void {
    this.store$.dispatch(createProduct({product}));
  }

  public deleteProduct(productId: string): void {
    this.store$.dispatch(deleteProduct({productId}));
  }


  public editProduct(product: Product): void {
    this.store$.dispatch(editProduct({product}));
  }
}
