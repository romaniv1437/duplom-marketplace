import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductsFacade} from "../../../facades/products.facade";
import {Product} from "../../../models/products.interface";
import {Observable} from "rxjs";

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss']
})
export class ProductsPageComponent implements OnInit {
  private productId: string = ''
  public product$: Observable<Product> = new Observable<Product>();
  constructor(private route: ActivatedRoute, private productsFacade: ProductsFacade) { }

  ngOnInit(): void {

    this.route.params
      .subscribe(() => {
        this.productId = this.route.snapshot.params['id'] || 'no-id';
        this.loadProductById(this.productId)
      })

    this.product$ = this.productsFacade.product$;
  }

  private loadProductById(productId: string): void {
    this.productsFacade.loadProductById(productId)
  }
}
