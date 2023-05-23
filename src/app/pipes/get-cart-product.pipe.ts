import { Pipe, PipeTransform } from '@angular/core';
import {CartProduct} from "../models/cart.interface";

@Pipe({
  name: 'getCartProduct'
})
export class GetCartProductPipe implements PipeTransform {

  transform(cartProducts: CartProduct[], productId: number): CartProduct | undefined {

    if (!cartProducts) {
      return undefined;
    }

    return cartProducts.filter(cartProduct => cartProduct.id === productId)[0];
  }

}
