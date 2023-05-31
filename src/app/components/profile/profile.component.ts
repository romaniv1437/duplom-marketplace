import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {AuthFacade} from 'src/app/facades/auth.facade';
import {ProductsFacade} from 'src/app/facades/products.facade';
import {User} from "../../models/user.interface";
import {Product} from "../../models/products.interface";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
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
