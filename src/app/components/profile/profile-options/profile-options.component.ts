import {Component, Input, OnInit} from '@angular/core';
import {Product, ProductsModel} from "../../../models/products.interface";
import {Observable} from "rxjs";
import {User} from "../../../models/user.interface";
import {AuthFacade} from "../../../facades/auth.facade";
import {ProductsFacade} from "../../../facades/products.facade";
import {PaginationData} from "../../../models/core.interface";

@Component({
  selector: 'app-profile-options',
  templateUrl: './profile-options.component.html',
  styleUrls: ['./profile-options.component.scss']
})
export class ProfileOptionsComponent implements OnInit {
  public user$: Observable<User> = new Observable<User>();
  public userProductsModel$: Observable<ProductsModel> = new Observable<ProductsModel>()

  constructor(private authFacade: AuthFacade, private productsFacade: ProductsFacade) {
  }

  ngOnInit(): void {
    this.user$ = this.authFacade.user$;
    this.userProductsModel$ = this.productsFacade.userProductsModel$;

    this.getProducts({page: 0, count: 4, searchKey: ''} as PaginationData);
  }


  public getProducts(paginationData: PaginationData): void {
    this.productsFacade.loadUserProducts(paginationData);
  }
}
