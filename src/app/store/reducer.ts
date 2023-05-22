import { createReducer, on } from '@ngrx/store';
import {Category, Product} from '../models/products.interface';
import * as actions from './actions'

export const baseFeatureKey = "store";

export interface State {
  isLoading: boolean;
  error: string;

  category: Category[];

  products: Product[];
  currentProduct: Product;
}

export const initialState: State = {
  isLoading: false,
  error: '',

  category: [],

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
  })
);
