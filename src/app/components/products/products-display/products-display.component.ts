import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Product} from 'src/app/models/products.interface';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {ProductsFacade} from "../../../facades/products.facade";
import {CartProduct} from "../../../models/cart.interface";
import {CartFacade} from "../../../facades/cart.facade";

@Component({
  selector: 'app-products-display',
  templateUrl: './products-display.component.html',
  styleUrls: ['./products-display.component.scss'],
})
export class ProductsDisplayComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;
  @Input() productsAlign: string = 'start';
  @Input() set products(products: Product[]) {
    this.productsItems = products;
    this.paginator?.firstPage();
    this.length = products?.length;
    this.getData(this.pageEvent);
  };

  @Input() cartProducts: CartProduct[] = [];
  public productsDataSource: Product[] = [];

  productsItems: Product[] = [];
  length = 0;
  pageIndex = 0;
  pageSize = 7;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent!: PageEvent;
  mockImage: string = 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg';

  constructor(private cartFacade: CartFacade) {
  }

  ngOnInit(): void {
  }

  getData(event?: PageEvent) {
    const page = event ? event : {pageIndex: this.pageIndex, pageSize: this.pageSize};
    this.productsDataSource = this.productsItems?.slice(page.pageIndex * page.pageSize, page.pageIndex * page.pageSize + page.pageSize);
    return event || this.pageEvent;
  }

  addProductToCart(product: Product): void {
    const cartProduct = {...product, qty: 1, userId: 'no-user', totalPrice: product.price} as CartProduct;
    this.cartFacade.addProductToCart(cartProduct)
  }
}
