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
  CategoryModel, CurrencyModel,
} from "../models/category.interface";
import {FilterService} from "./filter.service";
import {CartProduct, Order, OrderProductModel, OrderProductPayload, OrderResponse} from "../models/cart.interface";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  BASE_URL = 'http://127.0.0.1:8000/'

  constructor(
    private http: HttpClient,
    private mockService: MockService,
    private authService: AuthService,
    private filterService: FilterService
  ) {
  }

  private createUserBody(user: User): UserModel {
    return {
      ...user,
      username: user.username.toLowerCase(),
      first_name: user.firstName,
      last_name: user.lastName
    } as UserModel
  }

  loadProducts(loadData: { paginationData: PaginationData }): Observable<Product[]> {
    return this.http.get<ProductModel[]>(this.BASE_URL + 'products/')
      .pipe(
        map(res => res.map((r: any) => this.productsAdapter(r))),
        catchError(this.errorHandler))
  }

  searchProducts(search: string, category?: string): Observable<Product[]> {
    return this.http.get<ProductModel[]>(this.BASE_URL + 'products/')
      .pipe(
        map(res =>
          this.filterService.productsCategoryFilter(res.map((r: any) => this.productsAdapter(r)), category || '')
            .filter(product => this.filterService.productsFilter(product, search))
        ),
        catchError(this.errorHandler))
  }

  loadUserProducts(): Observable<Product[]> {
    return this.http.get<ProductModel[]>(this.BASE_URL + 'myproducts/')
      .pipe(
        map(res => res.map((r: any) => this.productsAdapter(r))),
        catchError(this.errorHandler))
  }

  loadProductById(productId: string): Observable<Product> {
    return this.http.get<ProductModel>(this.BASE_URL + 'products/' + productId + '/')
      .pipe(
        map(res => (this.productsAdapter(res))),
        catchError(this.errorHandler))
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<UserModel>(this.BASE_URL + 'login/', {username: email.toLowerCase(), password})
      .pipe(
        tap(res => this.authService.setToken(res.tokens)),
        switchMap(() => this.getUser()),
        map(res => res),
        catchError(this.errorHandler))
  }

  register(user: User, password: string, confirmPassword: string): Observable<User> {
    const userBody = {
      password: password,
      confirm_password: confirmPassword,
      username: user.username.toLowerCase(),
      first_name: user.firstName,
      last_name: user.lastName
    }
    return this.http.post<UserModel>(this.BASE_URL + 'register/', userBody)
      .pipe(
        tap(res => this.authService.setToken(res.tokens)),
        switchMap(() => this.getUser()),
        map(res => res),
        catchError(this.errorHandler))
  }

  getUser(): Observable<User> {

    return this.http.get<UserModel>(this.BASE_URL + 'me/')
      .pipe(
        map(res => this.userAdapter(res)),
        catchError(this.errorHandler))
  }

  getUserByUsername(username: string): Observable<User> {

    return this.http.get<UserModel>(this.BASE_URL + 'profile/' + username + '/')
      .pipe(
        map(res => this.userAdapter(res)),
        catchError(this.errorHandler))
  }

  setUserRating(username: string, rating: number): Observable<User> {
    return this.http.delete<UserModel>(this.BASE_URL + 'profile/' + username + '/').pipe(switchMap(() => {
      return this.http.post<UserModel>(this.BASE_URL + 'profile/' + username + '/', {stars: rating})
        .pipe(
          map(res => this.userAdapter(res)),
          catchError(this.errorHandler));
    })).pipe(catchError(this.errorHandler));
  }

  loadCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.BASE_URL + 'category/')
      .pipe(
        map(res => (res.map(category => this.categoryAdapter(category)))),
        catchError(this.errorHandler))
  }

  loadCurrencies(): Observable<CurrencyModel> {
    return this.http.get<CurrencyModel>(this.BASE_URL + 'currency/')
      .pipe(
        catchError(this.errorHandler))
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<ProductModel>(this.BASE_URL + 'add-products/', this.createProductBody(product))
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

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<ProductModel>(this.BASE_URL + 'products/' + productId + '/').pipe(catchError(this.errorHandler))
  }

  deleteProfilePicture(username: string): Observable<any> {
    return this.http.delete<ProductModel>(this.BASE_URL + 'settings/').pipe(catchError(this.errorHandler))
  }

  editProduct(product: Product): Observable<Product> {
    return this.http.put<ProductModel>(this.BASE_URL + 'products/' + product.slug + '/', this.createProductBody(product))
      .pipe(
        map((productResponse) => of(productResponse)
          .pipe(
            combineLatestWith(product.imageFiles.length
              ? zip(product.imageFiles.map(imageFile => this.addProductImage(imageFile, productResponse.slug)))
              : of([])
            ),
            map(([productResponse]) => (productResponse))
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
            map(([userResponse, userWithImage]) => ({
              ...userResponse,
              avatar: userWithImage.profilePicture ? userWithImage.profilePicture : userResponse.avatar
            })),
          ),
        ),
        switchMap((userWithImage: Observable<UserModel>) => userWithImage
          .pipe(map(userWI => this.userAdapter(userWI)))),
        catchError(this.errorHandler))
  }

  changePassword(passwords: { old_password: string; new_password: string; confirm_password: string }): Observable<any> {
    return this.http.post(this.BASE_URL + 'change-password/', {...passwords})
      .pipe(catchError(this.errorHandler))
  }

  sendOrder(order: Order): Observable<any> {
    return this.http.post<OrderResponse>(this.BASE_URL + 'create-orders/', this.createOrderBody(order))
      .pipe(
        map((orderResponse) => of(orderResponse)
          .pipe(
            combineLatestWith(order.products.length
              ? zip(order.products.map(cartProduct => this.addOrderProduct(cartProduct, orderResponse.id)))
              : of([])
            ),
            map(([orderResponse, products]) => ({...orderResponse, products})),
            tap(res => console.log(res))
          ),
        ),
        switchMap((productWithImageResponse: any) => productWithImageResponse),
      tap(res => console.log(res)),
        catchError(this.errorHandler))
  }

  addOrderProduct(product: CartProduct, orderId: number): Observable<OrderProductModel> {
    return this.http.post<OrderProductModel>(this.BASE_URL + 'create-orders-products/', this.createOrderProductBody(product, orderId))
      .pipe(catchError(this.errorHandler))
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<any>(this.BASE_URL + 'myorders/buy/')
      .pipe(map(res => res.map((order: OrderResponse) => this.orderAdapter(order))),
        catchError(this.errorHandler))
  }

  getUserSells(): Observable<Order[]> {
    return this.http.get<any>(this.BASE_URL + 'myorders/sell/')
      .pipe(map(res => res.map((order: OrderResponse) => this.sellAdapter(order))),
        catchError(this.errorHandler))
  }

  setSellStatus(status: string, productId: number): Observable<any> {
    return this.http.put<any>(this.BASE_URL + 'myorders/sell/', {status, product: productId})
      .pipe(catchError(this.errorHandler))
  }

  addProductImage(imageFile: File, productId: string): Observable<any> {
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
      currency: product.currency,
      image: product.photo ? product.photo[0] : '',
      images: product.photo,
      user: {
        ...product.user,
        firstName: product.user.first_name,
        lastName: product.user.last_name,
        profilePicture: product.user.avatar,
      },
      slug: product.slug
    } as unknown as Product
  }

  private createProductBody(product: Product): ProductModel {
    return {
      title: product.title,
      price: product.price,
      description: product.description,
      currency: product.currency,
      category: product.category
    } as unknown as ProductModel
  }

  private userAdapter(user: UserModel): UserModel {
    return {
      ...user,
      firstName: user.first_name,
      lastName: user.last_name,
      profilePicture: user.avatar,
      products: user.products?.map(product => this.productsAdapter(product as any))
    }
  }

  private categoryAdapter(category: CategoryModel): Category {
    return {
      ...category,
      url: '/products/' + category.slug,
    }
  }

  private orderAdapter(order: OrderResponse): Order {
    const products = order.info
      .map(info => this.orderProductAdapter(info))
    return {
      firstName: order.first_name,
      lastName: order.last_name,
      email: order.email,
      postalCode: order.post_index,
      productsQuantity: products
        .map(product => product.qty)
        .reduce((acc, curr) => acc + curr, 0), //order.count_products
      products: products,
      timeCreated: new Date(order.time_create),
      totalPrice: products
        .map(product => product.totalPrice)
        .reduce((acc, curr) => acc + curr, 0)
    } as unknown as Order
  }

  private sellAdapter(order: any): Order {
    const orderInfo = order.info[0];
    return {
      ...this.orderAdapter({...orderInfo, info: order.products}),
      user: {
        firstName: orderInfo.first_name,
        lastName: orderInfo.last_name,
        username: orderInfo.buyer.username || '',
      } as User,
    } as unknown as Order
  }

  private createOrderBody(order: Order): OrderResponse {
    return {
      ...order,
      first_name: order.firstName,
      last_name: order.lastName,
      email: order.email,
      post_index: order.postalCode,
      count_products: order.productsQuantity,
      country: order.country,
      city: order.city
    } as unknown as OrderResponse
  }

  private orderProductAdapter(product: OrderProductModel): CartProduct {
    console.log(product)
    return {
      ...this.productsAdapter(product.products[0]),
      id: product.id,
      totalPrice: product.total_price,
      qty: product.count_products,
      image: product.products[0].photo[0],
      status: product.status

    } as unknown as CartProduct
  }

  private createOrderProductBody(product: CartProduct, orderId: number): OrderProductPayload {
    return {
      total_price: product.totalPrice,
      count_products: product.qty,
      seller: product.user.id,
      products: product.id,
      currency: "$",
      number_orders: orderId,
    } as OrderProductPayload
  }

  private errorHandler(error: any) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.error_message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.error_message}`;
    }
    console.error(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
