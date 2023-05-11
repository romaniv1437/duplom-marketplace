import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductsFacade} from "../../facades/products.facade";
import {Product} from "../../models/products.interface";
import {Observable} from "rxjs";
import {PaginationData} from "../../models/core.interface";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {

  public category: string = 'no-category'

  public products$: Observable<Product[]> = new Observable<Product[]>();

  constructor(private route: ActivatedRoute, private productsFacade: ProductsFacade) { }

  ngOnInit(): void {
    this.category = this.route.snapshot.params['category'] || 'no-category'

    this.products$ = this.productsFacade.products$;

    this.productsFacade.loadProducts({} as PaginationData, '')
  }

}
