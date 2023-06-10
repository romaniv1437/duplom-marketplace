import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductsFacade} from "../../../facades/products.facade";
import {Product} from "../../../models/products.interface";
import {Observable} from "rxjs";
import {CartProduct} from "../../../models/cart.interface";
import {CartFacade} from 'src/app/facades/cart.facade';
import {PlaceholderImages} from "../../../enums/placeholderImage.enum";
import {User} from "../../../models/user.interface";
import { BaseFacade } from 'src/app/facades/base.facade';
import { AuthFacade } from 'src/app/facades/auth.facade';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss']
})
export class ProductsPageComponent implements OnInit {

  public user$: Observable<User> = new Observable<User>();
  public cartProducts$: Observable<CartProduct[]> = new Observable<CartProduct[]>();
  public product$: Observable<Product> = new Observable<Product>();
  placeholderImages = PlaceholderImages;
  private productId: string = ''

  constructor(
    private route: ActivatedRoute,
    private productsFacade: ProductsFacade,
    private cartFacade: CartFacade,
    private authFacade: AuthFacade
  ) {
  }

  ngOnInit(): void {

    this.route.params
      .subscribe(() => {
        this.productId = this.route.snapshot.params['id'] || 'no-id';
        this.loadProductById(this.productId)
      })

    this.product$ = this.productsFacade.product$;
    this.cartProducts$ = this.cartFacade.cartProducts$;
    this.user$ = this.authFacade.user$;
  }

  addProductToCart(product: Product): void {
    const cartProduct = {...product, qty: 1, userId: 'no-user', totalPrice: product.price} as CartProduct;
    this.cartFacade.addProductToCart(cartProduct)
  }

  private loadProductById(productId: string): void {
    this.productsFacade.loadProductById(productId)
  }

  editProduct(productId: string) {
    this.productsFacade.loadProductById(productId)
  }
}
