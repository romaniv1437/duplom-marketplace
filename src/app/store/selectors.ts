import {createFeatureSelector, createSelector} from '@ngrx/store';
import {State} from "./reducer";

export const selectFeature =  createFeatureSelector<State>('store');

export const selectProducts = createSelector(
  selectFeature,
  (state) => state.products
);
