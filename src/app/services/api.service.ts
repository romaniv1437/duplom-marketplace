import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { MockService } from './mock.service';
import { PaginationData } from '../models/core.interface';
import {Observable, of, tap} from "rxjs";
import {Product, ProductModel, ProductsResponse} from '../models/products.interface';
import {map} from "rxjs/operators";
import {User, UserModel} from "../models/user.interface";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public mockProducts = this.mockService.products;
  BASE_URL = 'http://127.0.0.1:8000/\n'
  constructor(private http: HttpClient, private mockService: MockService, private authService: AuthService) { }

  private productsAdapter(product: ProductModel): Product {
    return {
      url: product.slug,
      id: product.id,
      title: product.title,
      price: parseFloat(product.price),
      description: product.description,
      categoryId: product.category,
      image: product.photo[0],
      images: product.photo
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

  login(email: string, password: string): Observable<UserModel> {
    return this.http.post<UserModel>(this.BASE_URL + 'login/', {username: email, password})
      .pipe(
        tap(res => this.authService.setToken(res.tokens)),
        map(res => (res)))
    /*return of({id: 1} as UserModel)*/
  }
  register(user: User, password: string): Observable<UserModel> {
    const userBody = {
      password: password,
      confirm_password: password,
      username: user.email,
      first_name: user.firstName,
      last_name: user.lastName
    }
    return this.http.post<UserModel>(this.BASE_URL + 'register/', userBody)
      .pipe(
        tap(res => this.authService.setToken(res.tokens)),
        map(res => (res)))
    /*return of({id: 1} as UserModel)*/
  }
}
