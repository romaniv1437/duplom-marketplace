import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of, switchMap, tap} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {
  createProduct,
  createProductSuccess, editProfile, editProfileSuccess,
  getUserInfo,
  getUserInfoSuccess,
  loadCategories,
  loadCategoriesSuccess,
  loadProductById,
  loadProductByIdSuccess,
  loadProducts,
  loadProductsSuccess,
  loadUserProducts,
  loadUserProductsSuccess,
  login,
  loginSuccess,
  register,
  registerSuccess,
  setError
} from "./actions";
import {ApiService} from "../services/api.service";
import {Router} from "@angular/router";

@Injectable()
export class BaseEffects {

  loadProducts$ = createEffect(() => this.actions$.pipe(
    ofType(loadProducts),
    switchMap((action) => this.apiService.loadProducts({...action})
      .pipe(
        map(products => loadProductsSuccess({productsResponse: products})),
        catchError((error) => of(setError({error})))
      )
    )
  ))

  createProduct$ = createEffect(() => this.actions$.pipe(
    ofType(createProduct),
    switchMap((action) => this.apiService.createProduct(action.product)
      .pipe(
        map(product => createProductSuccess({product})),
        catchError((error) => of(setError({error})))
      )
    )
  ))

  createProductSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(createProductSuccess),
    tap(action => this.router.navigate([action.product.url]))
  ), {dispatch: false})

  editProfileSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(editProfileSuccess),
    tap(action => this.router.navigate(['/profile']))
  ), {dispatch: false})

  loadCategories$ = createEffect(() => this.actions$.pipe(
    ofType(loadCategories),
    switchMap((action) => this.apiService.loadCategories()
      .pipe(
        map(categories => loadCategoriesSuccess({categories: categories.results})),
        catchError((error) => of(setError({error})))
      )
    )
  ))

  loadUserProducts$ = createEffect(() => this.actions$.pipe(
    ofType(loadUserProducts),
    switchMap((action) => this.apiService.loadUserProducts()
      .pipe(
        map(products => loadUserProductsSuccess({productsResponse: products})),
        catchError((error) => of(setError({error})))
      )
    )
  ))

  loadProductById$ = createEffect(() => this.actions$.pipe(
    ofType(loadProductById),
    switchMap((action) => this.apiService.loadProductById(action.productId)
      .pipe(
        map(product => loadProductByIdSuccess({product})),
        catchError((error) => of(setError({error})))
      )
    )
  ))

  loginUser$ = createEffect(() => this.actions$.pipe(
    ofType(login),
    switchMap((action) => this.apiService.login(action.email, action.password)
      .pipe(
        map(user => loginSuccess({user})),
        catchError((error) => of(setError({error})))
      )
    )
  ))

  editUser$ = createEffect(() => this.actions$.pipe(
    ofType(editProfile),
    switchMap((action) => this.apiService.editProfile(action.user)
      .pipe(
        map(user => editProfileSuccess({user})),
        catchError((error) => of(setError({error})))
      )
    )
  ))

  getUser$ = createEffect(() => this.actions$.pipe(
    ofType(getUserInfo),
    switchMap((action) => this.apiService.getUser()
      .pipe(
        map(user => getUserInfoSuccess({user})),
        catchError((error) => of(setError({error})))
      )
    )
  ))

  registerUser$ = createEffect(() => this.actions$.pipe(
    ofType(register),
    switchMap((action) => this.apiService.register(action.user, action.password)
      .pipe(
        map(user => registerSuccess({user})),
        catchError((error) => of(setError({error})))
      )
    )
  ))

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private router: Router,
  ) {
  }
}
