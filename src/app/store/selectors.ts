import {createFeatureSelector, createSelector} from '@ngrx/store';
import {State} from "./reducer";

export const selectFeature =  createFeatureSelector<State>('store');

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
