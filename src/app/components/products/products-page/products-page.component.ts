import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductsFacade} from "../../../facades/products.facade";
import {Product} from "../../../models/products.interface";
import {Observable} from "rxjs";
import {CartProduct} from "../../../models/cart.interface";
import { CartFacade } from 'src/app/facades/cart.facade';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss']
})
export class ProductsPageComponent implements OnInit {
  public cartProducts$: Observable<CartProduct[]> = new Observable<CartProduct[]>();
  private productId: string = ''
  public product$: Observable<Product> = new Observable<Product>();
  mockImage: string = 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg';
  constructor(private route: ActivatedRoute, private productsFacade: ProductsFacade, private cartFacade:CartFacade) { }

  ngOnInit(): void {

    this.route.params
      .subscribe(() => {
        this.productId = this.route.snapshot.params['id'] || 'no-id';
        console.log(this.productId)
        this.loadProductById(this.productId)
      })

    this.product$ = this.productsFacade.product$;
    this.cartProducts$ = this.cartFacade.cartProducts$;
  }

  private loadProductById(productId: string): void {
    this.productsFacade.loadProductById(productId)
  }

  addProductToCart(product: Product): void {
    const cartProduct = {...product, qty: 1, userId: 'no-user', totalPrice: product.price} as CartProduct;
    this.cartFacade.addProductToCart(cartProduct)
  }
}
