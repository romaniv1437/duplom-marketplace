import {createAction, props} from "@ngrx/store";
import {CartProduct, Order} from "../models/cart.interface";
import {PaginationData} from "../models/core.interface";
import {Product, ProductsModel, ProductsResponse} from "../models/products.interface";
import {User} from "../models/user.interface";

export const loadProducts = createAction(
  "[PRODUCTS] load products",
  props<{ paginationData: PaginationData }>()
)

export const loadProductsSuccess = createAction(
  "[PRODUCTS] load products success",
  props<{ products: Product[] }>()
)

export const searchProducts = createAction(
  "[PRODUCTS] search products",
  props<{ search: string, category: string }>()
)

export const searchProductsSuccess = createAction(
  "[PRODUCTS] search products success",
  props<{ products: Product[] }>()
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
  "[USER] login",
  props<{ email: string, password: string }>()
)
export const logout = createAction(
  "[USER] logout",
)
export const loginSuccess = createAction(
  "[USER] login success",
  props<{ user: User }>()
)

export const register = createAction(
  "[USER] register",
  props<{ user: User, password: string, confirmPassword: string }>()
)
export const registerSuccess = createAction(
  "[USER] register success",
  props<{ user: User }>()
)
export const getUserInfo = createAction(
  "[USER] get user info",
)
export const getUserInfoByUserName = createAction(
  "[USER] get user info by username",
  props<{ username: string }>()
)

export const getUserInfoByUserNameSuccess = createAction(
  "[USER] get user info by username success",
  props<{ user: User }>()
)
export const getUserInfoSuccess = createAction(
  "[USER]  get user info success",
  props<{ user: User }>()
)

export const loadUserProducts = createAction(
  "[PRODUCTS] load user products",
  props<{ paginationData: PaginationData }>()
)
export const loadUserProductsSuccess = createAction(
  "[PRODUCTS] load user products success",
  props<{ products: Product[] }>()
)

export const loadCategories = createAction(
  "[CATEGORIES] load categories",
)
export const loadCategoriesSuccess = createAction(
  "[PRODUCTS] load categories success",
  props<{ categories: any }>()
)

export const loadCurrencies = createAction(
  "[CATEGORIES] load Currencies",
)
export const loadCurrenciesSuccess = createAction(
  "[PRODUCTS] load Currencies success",
  props<{ currencies: any }>()
)

export const createProduct = createAction(
  "[PRODUCTS] create product",
  props<{ product: Product }>()
)
export const createProductSuccess = createAction(
  "[PRODUCTS] create product success",
  props<{ product: Product }>()
)

export const deleteProduct = createAction(
  "[PRODUCTS] delete product",
  props<{ productId: string }>()
)

export const deleteProductSuccess = createAction(
  "[PRODUCTS] delete product success"
)

export const editProduct = createAction(
  "[PRODUCTS] edit product",
  props<{ product: Product }>()
)
export const editProductSuccess = createAction(
  "[PRODUCTS] edit product success",
  props<{ product: Product }>()
)

export const editProfile = createAction(
  "[USER] edit profile",
  props<{ user: User }>()
)

export const editProfileSuccess = createAction(
  "[USER] edit profile success",
  props<{ user: User }>()
)

export const deleteProfilePicture = createAction(
  "[USER] delete profile picture",
  props<{username: string}>()
)

export const deleteProfilePictureSuccess = createAction(
  "[USER] delete profile picture success"
)
export const changePassword = createAction(
  "[USER] change password",
  props<{ oldPassword: string; newPassword: string, confirmPassword: string}>()
)

export const changePasswordSuccess = createAction(
  "[USER] change password success",
)

export const setUserRating = createAction(
  "[USER] set user rating",
  props<{ username: string, rating: number }>()
)

export const setUserRatingSuccess = createAction(
  "[USER] set user rating success",
  props<{ user: User }>()
)
export const sendOrder = createAction(
  "[CART] send order",
  props<{ order: Order }>()
)

export const sendOrderSuccess = createAction(
  "[CART] send order success",
  props<{ order: Order }>()
)

export const getUserOrders = createAction(
  "[USER] get user orders",
)

export const getUserOrdersSuccess = createAction(
  "[USER] get user orders success",
  props<{ orders: Order[] }>()
)

export const getUserSells = createAction(
  "[USER] get user Sells",
)

export const getUserSellsSuccess = createAction(
  "[USER] get user Sells success",
  props<{ orders: Order[] }>()
)

export const setSellStatus = createAction(
  "[USER] set Sell Status",
  props<{status: string, productId: number}>()
)

export const setSellStatusSuccess = createAction(
  "[USER]  set Sell Status success",
)

export const setError = createAction(
  "[ERROR] set error",
  props<{ error: string }>()
)

export const clearState = createAction(
  "[STATE] clear state",
)
