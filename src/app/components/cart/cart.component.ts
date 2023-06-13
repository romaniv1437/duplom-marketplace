import {Component, OnInit} from '@angular/core';
import {CartFacade} from 'src/app/facades/cart.facade';
import {Cart, CartProduct} from "../../models/cart.interface";
import {Observable} from "rxjs";
import {PlaceholderImages} from "../../enums/placeholderImage.enum";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cart$: Observable<Cart> = new Observable<Cart>()
  placeholderImages = PlaceholderImages;

  constructor(private cartFacade: CartFacade) {
  }

  ngOnInit(): void {
    this.cart$ = this.cartFacade.cart$;
  }

  public removeFromCart(product: CartProduct): void {
    this.cartFacade.removeProductFromCart(product)
  }

  public changeProductQty(productId: number, isIncrease: boolean): void {
    this.cartFacade.changeProductQty(productId, isIncrease)
  }
}
