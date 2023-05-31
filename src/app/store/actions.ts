import {createAction, props} from "@ngrx/store";
import {CartProduct} from "../models/cart.interface";
import {PaginationData} from "../models/core.interface";
import {Product, ProductsResponse} from "../models/products.interface";
import {User} from "../models/user.interface";

export const loadProducts = createAction(
  "[PRODUCTS] load products",
  props<{ paginationData: PaginationData, category: string }>()
)

export const loadProductsSuccess = createAction(
  "[PRODUCTS] load products success",
  props<{ productsResponse: ProductsResponse }>()
)

export const loadProductById = createAction(
  "[PRODUCTS] load product by id",
  props<{ productId: string }>()
)

export const loadProductByIdSuccess = createAction(
  "[PRODUCTS] load product by id success",
  props<{ product: Product }>()
)

export const addProductToCart = createAction(
  "[CART] add product to cart",
  props<{ product: CartProduct }>()
)

export const removeProductFromCart = createAction(
  "[CART] remove product to cart",
  props<{ product: CartProduct }>()
)

export const changeProductQty = createAction(
  "[CART] change product quantity",
  props<{ productId: number, isIncrease: boolean }>()
)

export const login = createAction(
  "[AUTHORIZATION] login",
  props<{ email: string, password: string }>()
)
export const logout = createAction(
  "[AUTHORIZATION] logout",
)
export const loginSuccess = createAction(
  "[AUTHORIZATION] login success",
  props<{ user: User }>()
)

export const register = createAction(
  "[AUTHORIZATION] register",
  props<{ user: User, password: string }>()
)
export const registerSuccess = createAction(
  "[AUTHORIZATION] register success",
  props<{ user: User }>()
)
export const getUserInfo = createAction(
  "[AUTHORIZATION] get user info",
)
export const getUserInfoSuccess = createAction(
  "[AUTHORIZATION]  get user info success",
  props<{ user: User }>()
)

export const loadUserProducts = createAction(
  "[PRODUCTS] load user products",
)
export const loadUserProductsSuccess = createAction(
  "[PRODUCTS] load user products success",
  props<{ productsResponse: ProductsResponse }>()
)

export const loadCategories = createAction(
  "[CATEGORIES] load categories",
)
export const loadCategoriesSuccess = createAction(
  "[PRODUCTS] load categories success",
  props<{ categories: any }>()
)

export const createProduct = createAction(
  "[PRODUCTS] create product",
  props<{ product: Product }>()
)
export const createProductSuccess = createAction(
  "[PRODUCTS] create product success",
  props<{ product: Product }>()
)

export const setError = createAction(
  "[ERROR] set error",
  props<{ error: string }>()
)
