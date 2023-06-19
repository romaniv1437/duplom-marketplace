import {Component, OnInit} from '@angular/core';
import {CartFacade} from 'src/app/facades/cart.facade';
import {Cart, CartProduct} from "../../models/cart.interface";
import {Observable} from "rxjs";
import {PlaceholderImages} from "../../enums/placeholderImage.enum";
import {User} from "../../models/user.interface";
import { AuthFacade } from 'src/app/facades/auth.facade';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cart$: Observable<Cart> = new Observable<Cart>()
  user$: Observable<User> = new Observable<User>();
  placeholderImages = PlaceholderImages;

  constructor(private cartFacade: CartFacade, public authService: AuthService) {
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
