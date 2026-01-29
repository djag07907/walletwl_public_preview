import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LoginState } from "./login.state";

export const selectLoginState = createFeatureSelector<LoginState>("login");

export const selectIsLoading = createSelector(
  selectLoginState,
  (state: LoginState) => state.isLoading
);

export const selectError = createSelector(
  selectLoginState,
  (state: LoginState) => state.error
);

export const selectUser = createSelector(
  selectLoginState,
  (state: LoginState) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectLoginState,
  (state: LoginState) => state.isAuthenticated
);

export const selectSuccessMessage = createSelector(
  selectLoginState,
  (state: LoginState) => state.successMessage
);

export const selectToken = createSelector(
  selectLoginState,
  (state: LoginState) => state.user?.token || null
);
