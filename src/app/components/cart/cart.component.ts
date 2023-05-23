import { Component, OnInit } from '@angular/core';
import { CartFacade } from 'src/app/facades/cart.facade';
import {Cart, CartProduct} from "../../models/cart.interface";
import {Observable} from "rxjs";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cart$: Observable<Cart> = new Observable<Cart>()
  mockImage: string = 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg';
  constructor(private cartFacade: CartFacade) { }

  ngOnInit(): void {
    this.cart$ = this.cartFacade.cart$;
  }

}
