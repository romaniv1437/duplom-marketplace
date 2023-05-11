import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { MockService } from './mock.service';
import { PaginationData } from '../models/core.interface';
import {Observable, of} from "rxjs";
import {Product, ProductsResponse} from '../models/products.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private mockService: MockService) { }

  loadProducts(loadData: {paginationData: PaginationData, category: string}): Observable<ProductsResponse> {
    return of({
      ...loadData.paginationData,
      items: this.mockService.generateProducts(50)
    });
  }
}
