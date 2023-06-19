import { Component, OnInit } from '@angular/core';
import {Cart, CartProduct, Order} from "../../models/cart.interface";
import {Observable} from "rxjs";
import { CartFacade } from 'src/app/facades/cart.facade';
import {User} from "../../models/user.interface";
import { AuthFacade } from 'src/app/facades/auth.facade';
import {PlaceholderImages} from "../../enums/placeholderImage.enum";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Product } from 'src/app/models/products.interface';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {

  public orderForm: FormGroup = new FormGroup<any>({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    country: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required]),
  })

  public cart$: Observable<Cart> = new Observable<Cart>()
  public user$: Observable<User> = new Observable<User>()
  public placeholderImages = PlaceholderImages;

  constructor(private cartFacade: CartFacade, private authFacade: AuthFacade) { }

  ngOnInit(): void {
    this.cart$ = this.cartFacade.cart$;
    this.user$ = this.authFacade.user$;
  }

  public removeFromCart(product: CartProduct): void {
    this.cartFacade.removeProductFromCart(product)
  }

  public changeProductQty(productId: number, isIncrease: boolean): void {
    this.cartFacade.changeProductQty(productId, isIncrease)
  }

  public order(user: User, cartData: Cart): void {
    const order = {
      ...this.orderForm.value,
      totalPrice: cartData.totalPrice,
      products: cartData.products,
      user
    } as Order

    this.cartFacade.sendOrder(order);
  }
}
