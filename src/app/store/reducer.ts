import { createReducer, on } from '@ngrx/store';
import {Category, Product} from '../models/products.interface';
import * as actions from './actions'
import {Cart} from "../models/cart.interface";

export const baseFeatureKey = "store";

export interface State {
  isLoading: boolean;
  error: string;

  category: Category[];

  cart: Cart;

  products: Product[];
  currentProduct: Product;
}

export const initialState: State = {
  isLoading: false,
  error: '',

  category: [],

  cart: {} as Cart,

  products: [],
  currentProduct: {} as Product
};

export const baseReducer = createReducer(
  initialState,
  on(actions.loadProducts, (state) => {
    return {
      ...state,
      isLoading: true,
      error: ''
    }
  }),
  on(actions.loadProductsSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: '',

      products: action.productsResponse.items
    }
  }),
  on(actions.loadProductById, (state) => {
    return {
      ...state,
      isLoading: true,
      error: ''
    }
  }),
  on(actions.loadProductByIdSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: '',

      product: action.product
    }
  }),
  on(actions.addProductToCart, (state, action) => {
    return {
      ...state,
      cart: {
        ...state.cart,
        products: state.cart.products ? [...state.cart.products, action.product] : [action.product]
      }
    }
  }),
  on(actions.removeProductFromCart, (state, action) => {
    return {
      ...state,
      cart: {
        ...state.cart,
        products: state.cart.products?.filter(product => product.id !== action.product.id)
      }
    }
  }),
);
