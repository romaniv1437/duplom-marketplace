import {createReducer, on} from '@ngrx/store';
import {Product} from '../models/products.interface';
import * as actions from './actions'
import {Cart, CartProduct, Order} from "../models/cart.interface";
import {User} from "../models/user.interface";
import {Category, Currency} from "../models/category.interface";

export const baseFeatureKey = "store";

export interface State {
  isLoading: boolean;
  error: string;

  categories: Category[];
  currencies: Currency[];

  cart: Cart;

  products: Product[];
  filteredProducts: Product[];
  userProducts: Product[];
  userOrders: Order[];
  userSells: Order[];

  currentProduct: Product;

  user: User;
  profile: User;
}

export const initialState: State = {
  isLoading: false,
  error: '',

  categories: [],
  currencies: [],

  cart: {} as Cart,

  products: [],
  filteredProducts: [],
  userProducts: [],
  userOrders: [],
  userSells: [],

  currentProduct: {} as Product,

  user: {} as User,
  profile: {} as User
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

      products: action.products,
      filteredProducts: action.products,
    }
  }),
  on(actions.searchProducts, (state) => {
    return {
      ...state,
      isLoading: true,
      error: ''
    }
  }),
  on(actions.searchProductsSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: '',

      filteredProducts: action.products,
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

      userProducts: action.products
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
    const cartProducts = state.cart.products
      ? [...state.cart.products.filter(product => product.id !== action.product.id), action.product]
      : [action.product]
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
  on(actions.logout, (state) => {
    return {
      ...state,
      isLoading: false,
      error: '',
      user: initialState.user
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
  on(actions.editProfile, (state) => {
    return {
      ...state,
      isLoading: true,
      error: ''
    }
  }),
  on(actions.editProfileSuccess, (state, action) => {
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
  on(actions.getUserInfoByUserName, (state, action) => {
    return {
      ...state,
      isLoading: true,
      error: ''
    }
  }),
  on(actions.getUserInfoByUserNameSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      profile: action.user
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
  }),
  on(actions.loadCurrencies, (state, action) => {
    return {
      ...state,
      isLoading: true,
      error: ''
    }
  }),
  on(actions.loadCurrenciesSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      currencies: action.currencies
    }
  }),
  on(actions.createProduct, (state, action) => {
    return {
      ...state,
      isLoading: true,
      error: ''
    }
  }),
  on(actions.createProductSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      userProducts: [...state.userProducts, action.product]
    }
  }),
  on(actions.deleteProduct, (state, action) => {
    return {
      ...state,
      isLoading: true,
      error: ''
    }
  }),
  on(actions.deleteProductSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: ''
    }
  }),
  on(actions.deleteProfilePicture, (state, action) => {
    return {
      ...state,
      isLoading: true,
      error: ''
    }
  }),
  on(actions.deleteProfilePictureSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: ''
    }
  }),
  on(actions.editProduct, (state, action) => {
    return {
      ...state,
      isLoading: true,
      error: ''
    }
  }),
  on(actions.editProductSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      userProducts: [...state.userProducts.filter(product => product.id !== action.product.id), action.product]
    }
  }),
  on(actions.changePassword, (state, action) => {
    return {
      ...state,
      isLoading: true,
      error: ''
    }
  }),
  on(actions.changePasswordSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: '',
    }
  }),
  on(actions.setUserRating, (state, action) => {
    return {
      ...state,
      isLoading: true,
      error: ''
    }
  }),
  on(actions.setUserRatingSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: '',
      profile: action.user
    }
  }),
  on(actions.getUserOrders, (state, action) => {
    return {
      ...state,
      isLoading: true,
      error: '',
    }
  }),
  on(actions.getUserOrdersSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: '',
      userOrders: action.orders
    }
  }),
  on(actions.getUserSells, (state, action) => {
    return {
      ...state,
      isLoading: true,
      error: '',
    }
  }),
  on(actions.getUserSellsSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: '',
      userSells: action.orders
    }
  }),
  on(actions.sendOrder, (state, action) => {
    return {
      ...state,
      isLoading: true,
      error: '',
    }
  }),
  on(actions.sendOrderSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: '',
      cart: {} as Cart
    }
  }),
  on(actions.clearState, (state, action) => {
    return {
      ...initialState,
      categories: state.categories,
      currencies: state.currencies,
      user: state.user,
      cart: state.cart
    }
  }),
);

const getTotalPrice = (products: CartProduct[]): string => {
  const possibleCurrencies = [...new Map(products.map(product => product.currency).map(item =>
    [item['id'], item])).values()];

  let totalPrice = {
  }
  possibleCurrencies.map(currency => (totalPrice = {
    ...totalPrice,
    [currency.title]: parseFloat(products.filter(product => product.currency.id === currency.id)
      .reduce((totalPrice, product) => totalPrice + (product.totalPrice), 0).toFixed(2))
  }))

  return Object.keys(totalPrice).map(key => (`${totalPrice[key as keyof typeof totalPrice]} ${key}`)).join(', ')
}
