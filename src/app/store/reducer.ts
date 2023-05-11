import { createReducer, on } from '@ngrx/store';
import { Product } from '../models/products.interface';
import * as actions from './actions'

export const baseFeatureKey = "store";

export interface State {
  isLoading: boolean;
  error: string;

  products: Product[];
}

export const initialState: State = {
  isLoading: false,
  error: '',

  products: []
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
  })
);
