import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {EMPTY, of, switchMap} from 'rxjs';
import {map, exhaustMap, catchError} from 'rxjs/operators';
import {
  loadProductById,
  loadProductByIdSuccess,
  loadProducts,
  loadProductsSuccess,
  login,
  loginSuccess, register, registerSuccess,
  setError
} from "./actions";
import {ApiService} from "../services/api.service";

@Injectable()
export class BaseEffects {

  /* loadMovies$ = createEffect(() => this.actions$.pipe(
       ofType('[Movies Page] Load Movies'),
       exhaustMap(() => this.moviesService.getAll()
         .pipe(
           map(movies => ({ type: '[Movies API] Movies Loaded Success', payload: movies })),
           catchError(() => EMPTY)
         ))
     )
   );*/

  loadProducts$ = createEffect(() => this.actions$.pipe(
    ofType(loadProducts),
    switchMap((action) => this.apiService.loadProducts({...action})
      .pipe(
        map(products => loadProductsSuccess({productsResponse: products})),
        catchError((error) => of(setError({ error })))
      )
    )
  ))

  loadProductById$ = createEffect(() => this.actions$.pipe(
    ofType(loadProductById),
    switchMap((action) => this.apiService.loadProductById(action.productId)
      .pipe(
        map(product => loadProductByIdSuccess({product})),
        catchError((error) => of(setError({ error })))
      )
    )
  ))

  loginUser$ = createEffect(() => this.actions$.pipe(
    ofType(login),
    switchMap((action) => this.apiService.login(action.email, action.password)
      .pipe(
        map(user => loginSuccess({user})),
        catchError((error) => of(setError({ error })))
      )
    )
  ))


  registerUser$ = createEffect(() => this.actions$.pipe(
    ofType(register),
    switchMap((action) => this.apiService.register(action.user, action.password)
      .pipe(
        map(user => registerSuccess({user})),
        catchError((error) => of(setError({ error })))
      )
    )
  ))

  constructor(
    private actions$: Actions,
    private apiService: ApiService
  ) {
  }
}
