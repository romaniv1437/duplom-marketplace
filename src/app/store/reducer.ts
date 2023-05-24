import {createReducer, on} from '@ngrx/store';
import {Category, Product} from '../models/products.interface';
import * as actions from './actions'
import {Cart, CartProduct} from "../models/cart.interface";

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

      currentProduct: action.product
    }
  }),
  on(actions.addProductToCart, (state, action) => {
    const cartProducts = state.cart.products ? [...state.cart.products, action.product] : [action.product]
    return {
      ...state,
      cart: {
        ...state.cart,
        products: cartProducts,
        totalPrice: getTotalPrice(cartProducts)
      }
    }
  }),
  on(actions.removeProductFromCart, (state, action) => {
    const cartProducts = state.cart.products?.filter(product => product.id !== action.product.id)
    return {
      ...state,
      cart: {
        ...state.cart,
        products: cartProducts,
        totalPrice: getTotalPrice(cartProducts)
      }
    }
  }),
  on(actions.changeProductQty, (state, action) => {
    const cartProduct = state.cart.products?.filter(product => product.id === action.productId)[0];
    const cartProducts = state.cart.products.map(product => product.id === cartProduct.id ? ({
      ...cartProduct,
      qty: action.isIncrease ? cartProduct.qty + 1 : cartProduct.qty - 1,
      totalPrice: action.isIncrease ? cartProduct.totalPrice + cartProduct.price : cartProduct.totalPrice - cartProduct.price
    }) : product)
    if (cartProduct.qty === 1 && !action.isIncrease) {
      return {...state}
    }
    return {
      ...state,
      cart: {
        ...state.cart,
        products: cartProducts,
        totalPrice: getTotalPrice(cartProducts)
      }
    }
  }),
);

const getTotalPrice = (products: CartProduct[]): number => {
  return products.reduce((totalPrice, product) => totalPrice + (product.totalPrice), 0);
}
