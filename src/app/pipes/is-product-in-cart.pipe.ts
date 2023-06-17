import {Pipe, PipeTransform} from '@angular/core';
import {CartProduct} from "../models/cart.interface";

@Pipe({
  name: 'isProductInCart'
})
export class IsProductInCartPipe implements PipeTransform {

  transform(cartProducts: CartProduct[], productId: number): unknown {

    if (!cartProducts) {
      return;
    }
    return cartProducts.some(cartProduct => cartProduct.id === productId);
  }

}
