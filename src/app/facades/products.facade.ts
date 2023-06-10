import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Product, ProductsModel} from "../models/products.interface";
import {Observable} from "rxjs";
import {
  selectCurrentProduct,
  selectProductsForHome,
  selectProductsModel,
  selectUserProductsModel
} from "../store/selectors";
import {createProduct, editProduct, loadProductById, loadProducts, loadUserProducts} from "../store/actions";
import {PaginationData} from "../models/core.interface";

@Injectable({
  providedIn: 'root',
})
export class ProductsFacade {

  public productsModel$: Observable<ProductsModel> = new Observable<ProductsModel>()
  public userProductsModel$: Observable<ProductsModel> = new Observable<ProductsModel>()
  public product$: Observable<Product> = new Observable<Product>()
  public homePageProducts$: Observable<Product[]> = new Observable<Product[]>()

  constructor(private store$: Store) {
    this.productsModel$ = this.store$.select(selectProductsModel)
    this.userProductsModel$ = this.store$.select(selectUserProductsModel)

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

  public editProduct(product: Product): void {
    this.store$.dispatch(editProduct({product}));
  }
}
