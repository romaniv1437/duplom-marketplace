import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MockService} from './mock.service';
import {PaginationData} from '../models/core.interface';
import {combineLatestWith, Observable, of, switchMap, tap, throwError, zip} from "rxjs";
import {Product, ProductModel, ProductsResponse} from '../models/products.interface';
import {catchError, map} from "rxjs/operators";
import {User, UserModel} from "../models/user.interface";
import {AuthService} from "./auth.service";
import {Category, CategoryModel} from "../models/category.interface";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public mockProducts = this.mockService.products;
  BASE_URL = 'http://127.0.0.1:8000/'

  constructor(private http: HttpClient, private mockService: MockService, private authService: AuthService) {
  }

  private productsAdapter(product: ProductModel): Product {
    return {
      url: product.slug,
      id: product.id,
      title: product.title,
      price: parseFloat(product.price),
      description: product.description,
      categoryId: product.category,
      image: product.photo[0],
      images: product.photo,
      user: product.user
    } as unknown as Product
  }

  private createProductBody(product: Product): ProductModel {
    return {
      title: product.title,
      price: product.price,
      description: product.description,
      currency: 1,
      category: product.category
    } as unknown as ProductModel
  }

  private userAdapter(user: UserModel): User {
    return {
      ...user,
      firstName: user.first_name,
      lastName: user.last_name
    }
  }

  private categoryAdapter(category: CategoryModel): Category {
    return {
      ...category,
      url: '/products/' + category.slug,
    }
  }

  loadProducts(loadData: { paginationData: PaginationData, category: string }): Observable<ProductsResponse> {
    return this.http.get<ProductModel[]>(this.BASE_URL + 'orders/')
      .pipe(
        map(res => ({items: res.map((r: any) => this.productsAdapter(r))} as ProductsResponse)),
        catchError(this.errorHandler))
    /* return of({items: this.mockProducts} as ProductsResponse)*/
  }

  loadUserProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductModel[]>(this.BASE_URL + 'myorders/')
      .pipe(
        map(res => ({items: res.map((r: any) => this.productsAdapter(r))} as ProductsResponse)),
        catchError(this.errorHandler))
    /* return of({items: this.mockProducts} as ProductsResponse)*/
  }

  loadProductById(productId: string): Observable<Product> {
    return this.http.get<ProductModel>(this.BASE_URL + 'orders/' + productId + '/')
      .pipe(
        map(res => (this.productsAdapter(res))),
        catchError(this.errorHandler))
    /*return of({...this.mockProducts.filter(product => Number(product.id) === Number(productId))[0]} as Product)*/
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<UserModel>(this.BASE_URL + 'login/', {username: email, password})
      .pipe(
        tap(res => this.authService.setToken(res.tokens)),
        map(res => this.userAdapter(res)),
        catchError(this.errorHandler))
    /*return of({id: 1} as UserModel)*/
  }

  register(user: User, password: string): Observable<User> {
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
        map(res => this.userAdapter(res)),
        catchError(this.errorHandler))
    /*return of({id: 1} as UserModel)*/
  }

  getUser(): Observable<User> {

    return this.http.get<UserModel>(this.BASE_URL + 'me/')
      .pipe(
        map(res => this.userAdapter(res)),
        catchError(this.errorHandler))
  }

  loadCategories(): Observable<Category[]> {
    return this.http.get<CategoryModel[]>(this.BASE_URL + 'category/')
      .pipe(
        map(res => res.map(category => this.categoryAdapter(category))),
        catchError(this.errorHandler))
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<ProductModel>(this.BASE_URL + 'add-orders/', this.createProductBody(product))
      .pipe(
        map((productResponse) => of(productResponse)
          .pipe(
            combineLatestWith(product.imageFiles.length
              ? zip(product.imageFiles.map(imageFile => this.addProductImage(imageFile, productResponse.slug)))
              : of([])
            ),
            map(([productResponse, productWithImage] )=> (productResponse)),
            map(products => products)
          ),
        ),
        switchMap((productWithImageResponse: Observable<ProductModel>) => productWithImageResponse.pipe(map(prWI => this.productsAdapter(prWI)))),
        catchError(this.errorHandler))
  }

  addProductImage(imageFile: File, productId: string): Observable<Product> {
    let formData = new FormData()
    formData.append(imageFile.name, imageFile, imageFile.name)
    return this.http.post<ProductModel>(this.BASE_URL + 'add-photo/' + productId + '/', formData)
      .pipe(
        map(res => this.productsAdapter(res)),
        catchError(this.errorHandler), )
  }


  private errorHandler(error: any) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
