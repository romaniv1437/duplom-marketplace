import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProductsFacade} from "../../facades/products.facade";
import {Product, ProductsModel} from "../../models/products.interface";
import {BehaviorSubject, debounceTime, Observable, startWith, Subject, takeUntil} from "rxjs";
import {PaginationData} from "../../models/core.interface";
import {CartProduct} from "../../models/cart.interface";
import {CartFacade} from 'src/app/facades/cart.facade';
import {AuthFacade} from 'src/app/facades/auth.facade';
import {User} from "../../models/user.interface";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ControlSubscribtionComponent} from "../../control-subscriptions/controlSubscribtion.component";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent extends ControlSubscribtionComponent implements OnInit {

  public category: string = 'no-category'
  public products$: Observable<Product[]> = new Observable<Product[]>()
  public cartProducts$: Observable<CartProduct[]> = new Observable<CartProduct[]>();
  public user$: Observable<User> = new Observable<User>();

  public isProductsPage: boolean = false;

  public searchForm: FormGroup = new FormGroup({
    search: new FormControl('')
  })

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsFacade: ProductsFacade,
    private cartFacade: CartFacade,
    private authFacade: AuthFacade
  ) {
    super()
  }

  ngOnInit(): void {

    this.router.events.pipe(takeUntil(this.destroyed$),
      startWith({})).subscribe(() => this.isProductsPage = this.router.url !== '/')

    this.route.params
      .subscribe(() => {
        this.category = this.route.snapshot.params['category'] || 'no-category';

        if (this.category !== 'no-category') {
          this.productsFacade.searchProducts('', this.category);
          this.products$ = this.productsFacade.filteredProducts$;
        } else {
          this.productsFacade.loadProducts({} as PaginationData)
          this.products$ = this.productsFacade.products$;
        }
      })

    this.cartProducts$ = this.cartFacade.cartProducts$;
    this.user$ = this.authFacade.user$;

    this.searchForm.valueChanges
      .pipe(takeUntil(this.destroyed$),)
      .subscribe(value => {
        const { search } = value;
        const isSearchEmpty = search.length <= 0;

        if (isSearchEmpty) {
          this.products$ = this.productsFacade.products$;
          if (this.category !== 'no-category') {
            this.productsFacade.searchProducts('', this.category);
            this.products$ = this.productsFacade.filteredProducts$;
          }
        } else {
          this.products$ = this.productsFacade.filteredProducts$;
        }

        const isUrlMatching = this.router.url !== 'products/all';
        const isNoCategory = this.category === 'no-category';

        if (isUrlMatching && isNoCategory) {
          this.router.navigate(['products/all']).then(r => r);
        }

        this.productsFacade.searchProducts(search, this.category);
      });
  }

  public getProducts(paginationData: PaginationData) {
    this.productsFacade.loadProducts(paginationData)
  }
}
