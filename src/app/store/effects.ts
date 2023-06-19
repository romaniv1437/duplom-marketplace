import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of, switchMap, tap} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {
  changePassword,
  changePasswordSuccess,
  createProduct,
  createProductSuccess,
  deleteProduct,
  deleteProductSuccess, deleteProfilePicture, deleteProfilePictureSuccess,
  editProduct,
  editProductSuccess,
  editProfile,
  editProfileSuccess,
  getUserInfo,
  getUserInfoByUserName,
  getUserInfoByUserNameSuccess,
  getUserInfoSuccess, getUserOrders, getUserOrdersSuccess, getUserSells, getUserSellsSuccess,
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
  registerSuccess, searchProducts, searchProductsSuccess, sendOrder, sendOrderSuccess,
  setError, setSellStatus, setSellStatusSuccess,
  setUserRating,
  setUserRatingSuccess
} from "./actions";
import {ApiService} from "../services/api.service";
import {Router} from "@angular/router";

@Injectable()
export class BaseEffects {

  loadProducts$ = createEffect(() => this.actions$.pipe(
    ofType(loadProducts),
    switchMap((action) => this.apiService.loadProducts({...action})
      .pipe(
        map(products => loadProductsSuccess({products})),
        catchError((error) => of(setError({error})))
      )
    )
  ))

  searchProducts$ = createEffect(() => this.actions$.pipe(
    ofType(searchProducts),
    switchMap((action) => this.apiService.searchProducts(action.search, action.category)
      .pipe(
        map(products => searchProductsSuccess({products})),
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

  deleteProduct$ = createEffect(() => this.actions$.pipe(
    ofType(deleteProduct),
    switchMap((action) => this.apiService.deleteProduct(action.productId)
      .pipe(
        map(() => deleteProductSuccess()),
        catchError((error) => of(setError({error})))
      )
    )
  ))

  deleteProfilePicture$ = createEffect(() => this.actions$.pipe(
    ofType(deleteProfilePicture),
    switchMap((action) => this.apiService.deleteProfilePicture(action.username)
      .pipe(
        map(() => deleteProfilePictureSuccess()),
        catchError((error) => of(setError({error})))
      )
    )
  ))

  editProduct$ = createEffect(() => this.actions$.pipe(
    ofType(editProduct),
    switchMap((action) => this.apiService.editProduct(action.product)
      .pipe(
        map(product => editProductSuccess({product})),
        catchError((error) => of(setError({error})))
      )
    )
  ))

  createProductSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(createProductSuccess, editProductSuccess),
    tap(action => this.router.navigate([action.product.url]))
  ), {dispatch: false})

  editProfileSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(editProfileSuccess, changePasswordSuccess, deleteProductSuccess, deleteProfilePictureSuccess),
    tap(action => this.router.navigate(['/profile']))
  ), {dispatch: false})

  sendOrderSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(sendOrderSuccess),
    tap(action => this.router.navigate(['/']))
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

  changePassword$ = createEffect(() => this.actions$.pipe(
    ofType(changePassword),
    switchMap((action) => this.apiService.changePassword({
        confirm_password: action.confirmPassword,
        old_password: action.oldPassword,
        new_password: action.newPassword
      })
      .pipe(
        map(() => changePasswordSuccess()),
        catchError((error) => of(setError({error})))
      )
    )
  ))

  loadUserProducts$ = createEffect(() => this.actions$.pipe(
    ofType(loadUserProducts),
    switchMap((action) => this.apiService.loadUserProducts()
      .pipe(
        map(products => loadUserProductsSuccess({products})),
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


  getUserByUsername$ = createEffect(() => this.actions$.pipe(
    ofType(getUserInfoByUserName),
    switchMap((action) => this.apiService.getUserByUsername(action.username)
      .pipe(
        map(user => getUserInfoByUserNameSuccess({user})),
        catchError((error) => of(setError({error})))
      )
    )
  ))
  setUserRating$ = createEffect(() => this.actions$.pipe(
    ofType(setUserRating),
    switchMap((action) => this.apiService.setUserRating(action.username, action.rating)
      .pipe(
        map(user => setUserRatingSuccess({user})),
        catchError((error) => of(setError({error})))
      )
    )
  ))

  registerUser$ = createEffect(() => this.actions$.pipe(
    ofType(register),
    switchMap((action) => this.apiService.register(action.user, action.password, action.confirmPassword)
      .pipe(
        map(user => registerSuccess({user})),
        catchError((error) => of(setError({error})))
      )
    )
  ))

  sendOrder$ = createEffect(() => this.actions$.pipe(
    ofType(sendOrder),
    switchMap((action) => this.apiService.sendOrder(action.order)
      .pipe(
        map(order => sendOrderSuccess({order})),
        catchError((error) => of(setError({error})))
      )
    )
  ))

  getUserOrders$ = createEffect(() => this.actions$.pipe(
    ofType(getUserOrders),
    switchMap((action) => this.apiService.getUserOrders()
      .pipe(
        map(orders => getUserOrdersSuccess({orders})),
        catchError((error) => of(setError({error})))
      )
    )
  ))

  getUserSells$ = createEffect(() => this.actions$.pipe(
    ofType(getUserSells),
    switchMap((action) => this.apiService.getUserSells()
      .pipe(
        map(orders => getUserSellsSuccess({orders})),
        catchError((error) => of(setError({error})))
      )
    )
  ))

  setSellStatus$ = createEffect(() => this.actions$.pipe(
    ofType(setSellStatus),
    switchMap((action) => this.apiService.setSellStatus(action.status, action.productId)
      .pipe(
        map(orders => setSellStatusSuccess({orders})),
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
