import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {selectCart, selectCartProductLength, selectCartProducts} from "../store/selectors";
import {addProductToCart} from "../store/actions";
import {Cart, CartProduct} from "../models/cart.interface";

@Injectable({
  providedIn: 'root',
})
export class CartFacade {

  public countCartProducts$: Observable<number> = new Observable<number>();
  public cartProducts$: Observable<CartProduct[]> = new Observable<CartProduct[]>();
  public cart$: Observable<Cart> = new Observable<Cart>()

  constructor(private store$: Store) {
    this.countCartProducts$ = this.store$.select(selectCartProductLength)
    this.cartProducts$ = this.store$.select(selectCartProducts)
    this.cart$ = this.store$.select(selectCart)
  }

  public addProductToCart(product: CartProduct): void {
    this.store$.dispatch(addProductToCart({product}))
  }
}
