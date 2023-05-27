import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { MockService } from './mock.service';
import { PaginationData } from '../models/core.interface';
import {Observable, of} from "rxjs";
import {Product, ProductModel, ProductsResponse} from '../models/products.interface';
import {map} from "rxjs/operators";
import {User} from "../models/user.interface";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public mockProducts = this.mockService.products;
  BASE_URL = 'http://127.0.0.1:8000/\n'
  constructor(private http: HttpClient, private mockService: MockService) { }

  private productsAdapter(product: ProductModel): Product {
    return {
      url: product.slug,
      id: product.id,
      title: product.title,
      price: parseFloat(product.price),
      description: product.description,
      categoryId: product.category,
      images: product.images
    } as unknown as Product
  }

  loadProducts(loadData: {paginationData: PaginationData, category: string}): Observable<ProductsResponse> {
    return this.http.get<ProductModel[]>(this.BASE_URL + 'orders/').pipe(map(res => (
      {items: res.map((r: any) => this.productsAdapter(r))} as ProductsResponse
    )))
   /* return of({items: this.mockProducts} as ProductsResponse)*/
  }

  loadProductById(productId: string): Observable<Product> {
    return this.http.get<ProductModel>(this.BASE_URL + 'orders/' + productId).pipe(map(res => (
      this.productsAdapter(res)
    )))
    /*return of({...this.mockProducts.filter(product => Number(product.id) === Number(productId))[0]} as Product)*/
  }

  login(email: string, password: string): Observable<User> {
    /*return this.http.get<ProductModel>(this.BASE_URL + 'orders/' + productId).pipe(map(res => (
      this.productsAdapter(res)
    )))*/
    return of({id: 1} as User)
  }
  register(user: User, password: string): Observable<User> {
    /*return this.http.get<ProductModel>(this.BASE_URL + 'orders/' + productId).pipe(map(res => (
      this.productsAdapter(res)
    )))*/
    return of({id: 1} as User)
  }
}
