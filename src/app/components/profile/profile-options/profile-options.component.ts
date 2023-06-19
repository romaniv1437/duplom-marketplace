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
import {Order} from "../../../models/cart.interface";
import {FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile-options',
  templateUrl: './profile-options.component.html',
  styleUrls: ['./profile-options.component.scss']
})
export class ProfileOptionsComponent extends ControlSubscribtionComponent implements OnInit {

  public orderProductStatusForm: FormGroup = new FormGroup<any>({
  })

  public user$: Observable<User> = new Observable<User>();
  public userProducts$: Observable<Product[]> = new Observable<Product[]>()
  public userOrders$: Observable<Order[]> = new Observable<Order[]>()
  public userSells$: Observable<Order[]> = new Observable<Order[]>()
  public cartProducts$: Observable<Product[]> = new Observable<Product[]>()

  public username: string | undefined;
  public userId: string | undefined;

  constructor(
    public authFacade: AuthFacade,
    private productsFacade: ProductsFacade,
    private cartFacade: CartFacade,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
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
      this.userOrders$ = this.cartFacade.userOrders$;
      this.userSells$ = this.cartFacade.userSells$;
      this.userProducts$ = this.productsFacade.userProducts$;
    }


    this.userSells$.pipe(takeUntil(this.destroyed$)).subscribe(orders => {
      orders.map(order => order.products.map(product => this.orderProductStatusForm.addControl(String(product.id), this.fb.control(product.status), {emitEvent: false})))
    })
    this.authFacade.user$.pipe(takeUntil(this.destroyed$)).subscribe(user => {
      this.userId = user.username;
    })

    this.productsFacade.loadUserProducts({page: 0, count: 4, searchKey: ''} as PaginationData);

    this.orderProductStatusForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(value => {
      Object.keys(value).map(key => this.cartFacade.setSellStatus(value[key], Number(key)))
    })
  }

  public getFormControl(controlName: number): FormControl {
    return this.orderProductStatusForm.controls[String(controlName)] as FormControl
  }
}
