import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductsFacade} from "../../facades/products.facade";
import {Product} from "../../models/products.interface";
import {Observable} from "rxjs";
import {PaginationData} from "../../models/core.interface";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {

  public category: string = 'no-category'
  public products$: Observable<Product[]> = new Observable<Product[]>();

  constructor(private route: ActivatedRoute, private productsFacade: ProductsFacade) {
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

  }

  private loadProducts(category: string, params: PaginationData): void {
    this.productsFacade.loadProducts(params, category)
  }
}
