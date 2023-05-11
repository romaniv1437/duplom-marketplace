import {createAction, props} from "@ngrx/store";
import {PaginationData} from "../models/core.interface";
import {ProductsResponse} from "../models/products.interface";

export const loadProducts = createAction(
  "[PRODUCTS] load products",
  props<{paginationData: PaginationData, category: string}>()
)

export const loadProductsSuccess = createAction(
  "[PRODUCTS] load products success",
  props<{productsResponse: ProductsResponse}>()
)

export const setError = createAction(
  "[ERROR] set error",
  props<{error: string}>()
)
