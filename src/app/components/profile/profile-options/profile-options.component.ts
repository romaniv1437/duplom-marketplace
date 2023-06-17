import {Component, Input, OnInit} from '@angular/core';
import {Product, ProductsModel} from "../../../models/products.interface";
import {Observable, startWith, takeUntil} from "rxjs";
import {User} from "../../../models/user.interface";
import {AuthFacade} from "../../../facades/auth.facade";
import {ProductsFacade} from "../../../facades/products.facade";
import {PaginationData} from "../../../models/core.interface";
import {PlaceholderImages} from "../../../enums/placeholderImage.enum";
import {ActivatedRoute} from "@angular/router";
import {ControlSubscribtionComponent} from "../../../control-subscriptions/controlSubscribtion.component";
import {CartFacade} from "../../../facades/cart.facade";

@Component({
  selector: 'app-profile-options',
  templateUrl: './profile-options.component.html',
  styleUrls: ['./profile-options.component.scss']
})
export class ProfileOptionsComponent extends ControlSubscribtionComponent implements OnInit {
  public user$: Observable<User> = new Observable<User>();
  public userProducts$: Observable<Product[]> = new Observable<Product[]>()
  public cartProducts$: Observable<Product[]> = new Observable<Product[]>()

  public username: string | undefined;
  public userId: string | undefined;

  constructor(
    public authFacade: AuthFacade,
    private productsFacade: ProductsFacade,
    private cartFacade: CartFacade,
    private route: ActivatedRoute) {
    super()
  }

  ngOnInit(): void {

    this.username = this.route.snapshot.params['userId']
    if (this.username) {
      this.authFacade.getUserByUsername(this.username)
      this.user$ = this.authFacade.profile$;
      this.userProducts$ = this.productsFacade.profileProducts$;
      this.cartProducts$ = this.cartFacade.cartProducts$;

    } else {
      this.authFacade.getUser();
      this.user$ = this.authFacade.user$;
      this.userProducts$ = this.productsFacade.userProducts$;
    }

    this.authFacade.user$.pipe(takeUntil(this.destroyed$)).subscribe(user => {
      this.userId = user.username;
    })

    this.getProducts({page: 0, count: 4, searchKey: ''} as PaginationData);
  }


  public getProducts(paginationData: PaginationData): void {
    this.productsFacade.loadUserProducts(paginationData);
  }
}
