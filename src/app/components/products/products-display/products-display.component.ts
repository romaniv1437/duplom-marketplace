import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Product} from 'src/app/models/products.interface';
import {MatPaginator, PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-products-display',
  templateUrl: './products-display.component.html',
  styleUrls: ['./products-display.component.scss'],
})
export class ProductsDisplayComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;

  @Input() set products(products: Product[]) {
    this.productsItems = products;
    this.paginator?.firstPage();
    this.length = products.length;
    this.getData(this.pageEvent);
  };

  public productsDataSource: Product[] = [];

  productsItems: Product[] = [];
  length = 0;
  pageIndex = 0;
  pageSize = 7;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent!: PageEvent;

  constructor() {
  }

  ngOnInit(): void {
  }

  getData(event?: PageEvent) {
    const page = event ? event : {pageIndex: this.pageIndex, pageSize: this.pageSize};
    this.productsDataSource = this.productsItems.slice(page.pageIndex * page.pageSize, page.pageIndex * page.pageSize + page.pageSize);
    return event || this.pageEvent;
  }
}
