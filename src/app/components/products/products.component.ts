import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductsFacade} from "../../facades/products.facade";
import {Product, ProductsModel} from "../../models/products.interface";
import {Observable, takeUntil} from "rxjs";
import {PaginationData} from "../../models/core.interface";
import {CartProduct} from "../../models/cart.interface";
import {CartFacade} from 'src/app/facades/cart.facade';
import {AuthFacade} from 'src/app/facades/auth.facade';
import {User} from "../../models/user.interface";
import {FormControl, FormGroup} from "@angular/forms";
import {ControlSubscribtionComponent} from "../../control-subscriptions/controlSubscribtion.component";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent extends ControlSubscribtionComponent implements OnInit {

  public category: string = 'no-category'
  public products$:  Observable<Product[]> = new Observable<Product[]>()
  public cartProducts$: Observable<CartProduct[]> = new Observable<CartProduct[]>();
  public user$: Observable<User> = new Observable<User>();

  public searchForm: FormGroup = new FormGroup({
    search: new FormControl('')
  })

  constructor(
    private route: ActivatedRoute,
    private productsFacade: ProductsFacade,
    private cartFacade: CartFacade,
    private authFacade: AuthFacade
  ) {
    super()
  }

  ngOnInit(): void {

    this.route.params
      .subscribe(() => {
        this.category = this.route.snapshot.params['category'] || 'no-category';
        this.getProducts({page: 0, searchKey: '', count: 4} as PaginationData)
      })

    this.products$ = this.productsFacade.products$;

    this.cartProducts$ = this.cartFacade.cartProducts$;
    this.user$ = this.authFacade.user$;

    this.searchForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(value => {
        this.getProducts( {page: 0, searchKey: '', count: 4} as PaginationData)
      })
  }

  public getProducts(paginationData: PaginationData) {
    this.productsFacade.loadProducts(paginationData)
  }
}
