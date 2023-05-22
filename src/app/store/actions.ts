import {createAction, props} from "@ngrx/store";
import { CartProduct } from "../models/cart.interface";
import {PaginationData} from "../models/core.interface";
import {Product, ProductsResponse} from "../models/products.interface";

export const loadProducts = createAction(
  "[PRODUCTS] load products",
  props<{paginationData: PaginationData, category: string}>()
)

export const loadProductsSuccess = createAction(
  "[PRODUCTS] load products success",
  props<{productsResponse: ProductsResponse}>()
)

export const loadProductById = createAction(
  "[PRODUCTS] load product by id",
  props<{productId: string}>()
)

export const loadProductByIdSuccess = createAction(
  "[PRODUCTS] load product by id success",
  props<{product: Product}>()
)

export const addProductToCart = createAction(
  "[CART] add product to cart",
  props<{product: CartProduct}>()
)

export const removeProductFromCart = createAction(
  "[CART] remove product to cart",
  props<{product: CartProduct}>()
)


export const setError = createAction(
  "[ERROR] set error",
  props<{error: string}>()
)
