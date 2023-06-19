import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {
  selectCart,
  selectCartProductLength,
  selectCartProducts,
  selectUserOrders,
  selectUserSells
} from "../store/selectors";
import {
  addProductToCart,
  changeProductQty,
  getUserOrders,
  getUserSells,
  removeProductFromCart,
  sendOrder,
  setSellStatus
} from "../store/actions";
import {Cart, CartProduct, Order} from "../models/cart.interface";

@Injectable({
  providedIn: 'root',
})
export class CartFacade {

  public countCartProducts$: Observable<number> = new Observable<number>();
  public cartProducts$: Observable<CartProduct[]> = new Observable<CartProduct[]>();
  public cart$: Observable<Cart> = new Observable<Cart>()
  public userOrders$: Observable<Order[]> = new Observable<Order[]>()
  public userSells$: Observable<Order[]> = new Observable<Order[]>()

  constructor(private store$: Store) {
    this.countCartProducts$ = this.store$.select(selectCartProductLength);
    this.cartProducts$ = this.store$.select(selectCartProducts);
    this.cart$ = this.store$.select(selectCart);
    this.userOrders$ = this.store$.select(selectUserOrders);
    this.userSells$ = this.store$.select(selectUserSells);
  }

  public addProductToCart(product: CartProduct): void {
    this.store$.dispatch(addProductToCart({product}))
  }

  public removeProductFromCart(product: CartProduct): void {
    this.store$.dispatch(removeProductFromCart({product}))
  }

  public changeProductQty(productId: number, isIncrease: boolean): void {
    this.store$.dispatch(changeProductQty({productId, isIncrease}))
  }

  public sendOrder(order: Order): void {
    this.store$.dispatch(sendOrder({order}))
  }

  public getUserOrders(): void {
    this.store$.dispatch(getUserOrders())
  }

  public getUserSells(): void {
    this.store$.dispatch(getUserSells())
  }

  public setSellStatus(status: string, productId: number): void {
    this.store$.dispatch(setSellStatus({status, productId}))
  }
}
