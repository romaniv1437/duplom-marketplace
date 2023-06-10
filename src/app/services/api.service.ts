import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MockService} from './mock.service';
import {PaginationData} from '../models/core.interface';
import {combineLatestWith, Observable, of, switchMap, tap, throwError, zip} from "rxjs";
import {Product, ProductModel, ProductsModel, ProductsResponse} from '../models/products.interface';
import {catchError, map} from "rxjs/operators";
import {User, UserModel} from "../models/user.interface";
import {AuthService} from "./auth.service";
import {
  CategoriesModel,
  CategoriesResponse,
  Category,
  CategoryModel,
} from "../models/category.interface";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  BASE_URL = 'http://127.0.0.1:8000/'

  constructor(private http: HttpClient, private mockService: MockService, private authService: AuthService) {
  }

  private createUserBody(user: User): UserModel {
    return {
      ...user,
      first_name: user.firstName,
      last_name: user.lastName
    } as UserModel
  }

  loadProducts(loadData: { paginationData: PaginationData }): Observable<ProductsModel> {
    const search = !!loadData.paginationData.searchKey ? loadData.paginationData.searchKey + '/' : ''
    return this.http.get<ProductsResponse>(this.BASE_URL + 'orders/' + `?page=${loadData.paginationData.page+1}`)
      .pipe(
        map(res => ({
          countAll: res.count,
          nextPage: res.next,
          prevPage: res.previous,
          results: res.results.map((r: any) => this.productsAdapter(r))} as ProductsModel)),
        catchError(this.errorHandler))
  }

  loadUserProducts(): Observable<ProductsModel> {
    return this.http.get<ProductsResponse>(this.BASE_URL + 'myorders/')
      .pipe(
        map(res => ({
          countAll: res.count,
          nextPage: res.next,
          prevPage: res.previous,
          results: res.results.map((r: any) => this.productsAdapter(r))} as ProductsModel)),
        catchError(this.errorHandler))
  }

  loadProductById(productId: string): Observable<Product> {
    return this.http.get<ProductModel>(this.BASE_URL + 'orders/' + productId + '/')
      .pipe(
        map(res => (this.productsAdapter(res))),
        catchError(this.errorHandler))
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<UserModel>(this.BASE_URL + 'login/', {username: email, password})
      .pipe(
        tap(res => this.authService.setToken(res.tokens)),
        map(res => this.userAdapter(res)),
        catchError(this.errorHandler))
  }

  register(user: User, password: string): Observable<User> {
    const userBody = {
      password: password,
      confirm_password: password,
      username: user.username,
      first_name: user.firstName,
      last_name: user.lastName
    }
    return this.http.post<UserModel>(this.BASE_URL + 'register/', userBody)
      .pipe(
        tap(res => this.authService.setToken(res.tokens)),
        map(res => this.userAdapter(res)),
        catchError(this.errorHandler))
  }

  getUser(): Observable<User> {

    return this.http.get<UserModel>(this.BASE_URL + 'me/')
      .pipe(
        map(res => this.userAdapter(res)),
        catchError(this.errorHandler))
  }

  loadCategories(): Observable<CategoriesModel> {
    return this.http.get<CategoriesResponse>(this.BASE_URL + 'category/')
      .pipe(
        map(res => ({
          countAll: res.count,
          nextPage: res.next,
          prevPage: res.previous,
          results: res.results.map(category => this.categoryAdapter(category))
        })),
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
            map(([productResponse]) => (productResponse)),
            map(products => products)
          ),
        ),
        switchMap((productWithImageResponse: Observable<ProductModel>) => productWithImageResponse.pipe(map(prWI => this.productsAdapter(prWI)))),
        catchError(this.errorHandler))
  }

  editProduct(product: Product): Observable<Product> {
    return this.http.put<ProductModel>(this.BASE_URL + 'add-orders/', this.createProductBody(product))
      .pipe(
        map((productResponse) => of(productResponse)
          .pipe(
            combineLatestWith(product.imageFiles.length
              ? zip(product.imageFiles.map(imageFile => this.addProductImage(imageFile, productResponse.slug)))
              : of([])
            ),
            map(([productResponse]) => (productResponse)),
            map(products => products)
          ),
        ),
        switchMap((productWithImageResponse: Observable<ProductModel>) => productWithImageResponse.pipe(map(prWI => this.productsAdapter(prWI)))),
        catchError(this.errorHandler))
  }

  editProfile(user: User): Observable<User> {
    return this.http.put<UserModel>(this.BASE_URL + 'settings/', this.createUserBody(user))
      .pipe(
        map((userResponse) => of(userResponse)
          .pipe(combineLatestWith(!!user.imageFile ? this.addUserImage(user.imageFile, userResponse.id) : of(this.userAdapter(userResponse))),
            map(([userResponse, userWithImage]) => ({...userResponse, avatar: userWithImage.profilePicture ? userWithImage.profilePicture : userResponse.avatar})),
          ),
        ),
        switchMap((userWithImage: Observable<UserModel>) => userWithImage
          .pipe(map(userWI => this.userAdapter(userWI)))),
        catchError(this.errorHandler))
  }

  addProductImage(imageFile: File, productId: string): Observable<any>{
    let formData = new FormData()
    formData.append(imageFile.name, imageFile, imageFile.name)
    return this.http.post<ProductModel>(this.BASE_URL + 'add-photo/' + productId + '/', formData)
      .pipe(catchError(this.errorHandler),)
  }

  addUserImage(imageFile: File, userId: number): Observable<User> {
    let formData = new FormData()
    formData.append(imageFile.name, imageFile, imageFile.name)
    return this.http.post<UserModel>(this.BASE_URL + 'add-profile-photo/', formData)
      .pipe(
        map(res => this.userAdapter(res)),
        catchError(this.errorHandler),)
  }

  private productsAdapter(product: ProductModel): Product {
    return {
      url: 'products/item/' + product.slug,
      id: product.id,
      title: product.title,
      price: parseFloat(product.price),
      description: product.description,
      category: product.category,
      image: product.photo ? product.photo[0] : '',
      images: product.photo,
      user: this.userAdapter(product.user)
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
      lastName: user.last_name,
      profilePicture: user.avatar
    }
  }

  private categoryAdapter(category: CategoryModel): Category {
    return {
      ...category,
      url: '/products/' + category.slug,
    }
  }

  private errorHandler(error: any) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.error_message[0];
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.error_message[0]}`;
    }
    console.error(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
