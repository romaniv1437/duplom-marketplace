import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Product, ProductsModel} from 'src/app/models/products.interface';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {CartProduct} from "../../../models/cart.interface";
import {CartFacade} from "../../../facades/cart.facade";
import {PaginationData} from "../../../models/core.interface";
import {PlaceholderImages} from "../../../enums/placeholderImage.enum";
import {ProductsFacade} from "../../../facades/products.facade";

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
  public placeholderImages = PlaceholderImages;

  constructor(private cartFacade: CartFacade, private productsFacade: ProductsFacade) {
  }

  @Input() set products(products: ProductsModel) {
    this.productsItems = products.results || [];
    this.length = products?.results?.length;
    this.getData(this.pageEvent);
    this.paginator?.firstPage();
  };

  ngOnInit(): void {
    if (this.maxPageSize) {
      this.pageSizeOptions.push(this.maxPageSize);
      this.pageSize = this.maxPageSize;
    }
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

  protected readonly PlaceholderImages = PlaceholderImages;

  editProduct(productId: string) {
    this.productsFacade.loadProductById(productId)
  }
}
