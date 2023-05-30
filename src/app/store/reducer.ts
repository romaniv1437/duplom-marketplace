import {createReducer, on} from '@ngrx/store';
import {Product} from '../models/products.interface';
import * as actions from './actions'
import {Cart, CartProduct} from "../models/cart.interface";
import {User} from "../models/user.interface";
import {Category} from "../models/category.interface";

export const baseFeatureKey = "store";

export interface State {
  isLoading: boolean;
  error: string;

  categories: Category[];

  cart: Cart;

  products: Product[];
  userProducts: Product[];
  currentProduct: Product;

  user: User;
}

export const initialState: State = {
  isLoading: false,
  error: '',

  categories: [],

  cart: {} as Cart,

  products: [],
  userProducts: [],
  currentProduct: {} as Product,

  user: {} as User
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
  on(actions.loadUserProducts, (state) => {
    return {
      ...state,
      isLoading: true,
      error: ''
    }
  }),
  on(actions.loadUserProductsSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: '',

      userProducts: action.productsResponse.items
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
      totalPrice: action.isIncrease
        ? parseFloat((cartProduct.totalPrice + cartProduct.price).toFixed(2))
        : parseFloat((cartProduct.totalPrice - cartProduct.price).toFixed(2))
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
  on(actions.login, (state) => {
    return {
      ...state,
      isLoading: true,
      error: ''
    }
  }),
  on(actions.loginSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: '',
      user: action.user
    }
  }),
  on(actions.register, (state) => {
    return {
      ...state,
      isLoading: true,
      error: ''
    }
  }),
  on(actions.registerSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: '',
      user: action.user
    }
  }),
  on(actions.setError, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: action.error
    }
  }),
  on(actions.getUserInfo, (state, action) => {
    return {
      ...state,
      isLoading: true,
      error: ''
    }
  }),
  on(actions.getUserInfoSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      user: action.user
    }
  }),
  on(actions.loadCategories, (state, action) => {
    return {
      ...state,
      isLoading: true,
      error: ''
    }
  }),
  on(actions.loadCategoriesSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      categories: action.categories
    }
  })
);

const getTotalPrice = (products: CartProduct[]): number => {
  return parseFloat(products.reduce((totalPrice, product) => totalPrice + (product.totalPrice), 0).toFixed(2));
}
