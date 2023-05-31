import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductsFacade} from "../../facades/products.facade";
import {Product} from "../../models/products.interface";
import {Observable} from "rxjs";
import {PaginationData} from "../../models/core.interface";
import {CartProduct} from "../../models/cart.interface";
import {CartFacade} from 'src/app/facades/cart.facade';
import {AuthFacade} from 'src/app/facades/auth.facade';
import {User} from "../../models/user.interface";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {

  public category: string = 'no-category'
  public products$: Observable<Product[]> = new Observable<Product[]>();
  public cartProducts$: Observable<CartProduct[]> = new Observable<CartProduct[]>();
  public user$: Observable<User> = new Observable<User>();

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
        this.category = this.route.snapshot.params['category'] || 'no-category';
        this.loadProducts(this.category, {} as PaginationData)
      })

    if (!this.category) {
      this.products$ = this.productsFacade.homePageProducts$;
    } else {
      this.products$ = this.productsFacade.products$;
    }

    this.cartProducts$ = this.cartFacade.cartProducts$;
    this.user$ = this.authFacade.user$;
  }

  private loadProducts(category: string, params: PaginationData): void {
    this.productsFacade.loadProducts(params, category)
  }
}
