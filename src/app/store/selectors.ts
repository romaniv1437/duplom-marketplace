import {createFeatureSelector, createSelector} from '@ngrx/store';
import {State} from "./reducer";

export const selectFeature = createFeatureSelector<State>('store');


export const selectProducts = createSelector(
  selectFeature,
  (state) => state.products
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
);export const selectProfile = createSelector(
  selectFeature,
  (state) => state.profile
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

export const selectUserProducts = createSelector(
  selectFeature,
  (state) => state.user.products
);

export const selectUserOrders = createSelector(
  selectFeature,
  (state) => state.userOrders
);

export const selectUserSells = createSelector(
  selectFeature,
  (state) => state.userSells
);

export const selectProfileProducts = createSelector(
  selectFeature,
  (state) => state.profile.products
);

export const selectFilteredProducts = createSelector(
  selectFeature,
  (state) => state.filteredProducts
);



