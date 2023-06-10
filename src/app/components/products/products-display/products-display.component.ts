import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Product, ProductsModel} from 'src/app/models/products.interface';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {CartProduct} from "../../../models/cart.interface";
import {CartFacade} from "../../../facades/cart.facade";
import {PaginationData} from "../../../models/core.interface";

@Component({
  selector: 'app-products-display',
  templateUrl: './products-display.component.html',
  styleUrls: ['./products-display.component.scss'],
})
export class ProductsDisplayComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;
  @Output() paginationData: EventEmitter<PaginationData> = new EventEmitter<PaginationData>();
  @Input() productsAlign: string = 'start';
  @Input() userId: number | undefined;
  @Input() cartProducts: CartProduct[] = [];
  @Input() maxPageSize: number | undefined;
  public productsDataSource: Product[] = [];
  productsItems: Product[] = [];
  length = 0;
  pageIndex = 0;
  pageSize = 4;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent!: PageEvent;
  mockImage: string = 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg';

  constructor(private cartFacade: CartFacade) {
  }

  @Input() set products(products: ProductsModel) {
    this.productsItems = products.results || [];
    this.length = products?.countAll;
    this.paginator?.firstPage();
  };

  ngOnInit(): void {
    this.pageSize = this.maxPageSize || this.pageSize;
    this.getData(this.pageEvent);
  }

  getData(event?: PageEvent) {
    this.paginationData.emit({page: event?.pageIndex || 0, count: event?.pageSize || 8, searchKey: ''})
    return event || this.pageEvent;
  }

  addProductToCart(product: Product): void {
    const cartProduct = {...product, qty: 1, userId: 'no-user', totalPrice: product.price} as CartProduct;
    this.cartFacade.addProductToCart(cartProduct)
  }
}
