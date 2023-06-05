import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../../models/products.interface";
import {Observable} from "rxjs";
import {User} from "../../../models/user.interface";
import {AuthFacade} from "../../../facades/auth.facade";
import {ProductsFacade} from "../../../facades/products.facade";

@Component({
  selector: 'app-profile-options',
  templateUrl: './profile-options.component.html',
  styleUrls: ['./profile-options.component.scss']
})
export class ProfileOptionsComponent implements OnInit {
  public user$: Observable<User> = new Observable<User>();
  public products$: Observable<Product[]> = new Observable<Product[]>()

  constructor(private authFacade: AuthFacade, private productsFacade: ProductsFacade) {
  }

  ngOnInit(): void {
    this.user$ = this.authFacade.user$;
    this.products$ = this.productsFacade.userProducts$;

    this.productsFacade.loadUserProducts();
  }

}
