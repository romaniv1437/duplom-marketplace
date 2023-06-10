import {createFeatureSelector, createSelector} from '@ngrx/store';
import {State} from "./reducer";

export const selectFeature = createFeatureSelector<State>('store');


export const selectProductsModel = createSelector(
  selectFeature,
  (state) => state.productsModel
);
export const selectCurrentProduct = createSelector(
  selectFeature,
  (state) => state.currentProduct
);

export const selectProductsForHome = createSelector(
  selectFeature,
  (state) => state.products.filter((item, i) => i < 7)
);

export const selectCartProductLength = createSelector(
  selectFeature,
  (state) => state.cart.products?.length || 0
);
export const selectCartProducts = createSelector(
  selectFeature,
  (state) => state.cart.products
);
export const selectCart = createSelector(
  selectFeature,
  (state) => state.cart
);

export const selectUser = createSelector(
  selectFeature,
  (state) => state.user
);

export const selectError = createSelector(
  selectFeature,
  (state) => state.error
);

export const selectIsLoading = createSelector(
  selectFeature,
  (state) => state.isLoading
);


export const selectCategories = createSelector(
  selectFeature,
  (state) => state.categories
);

export const selectUserProductsModel = createSelector(
  selectFeature,
  (state) => state.userProductsModel
);


