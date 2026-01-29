import { createReducer, on } from "@ngrx/store";
import * as LoginActions from "./login.actions";
import { initialLoginState } from "./login.state";

export const loginReducer = createReducer(
  initialLoginState,

  on(LoginActions.loginRequest, (state) => ({
    ...state,
    isLoading: true,
    error: null,
    successMessage: null,
  })),

  on(LoginActions.loginSuccess, (state, { user, message }) => ({
    ...state,
    isLoading: false,
    isAuthenticated: true,
    user,
    error: null,
    successMessage: message,
  })),

  on(LoginActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    isAuthenticated: false,
    user: null,
    error,
    successMessage: null,
  })),

  on(LoginActions.logout, () => ({
    ...initialLoginState,
  })),

  on(LoginActions.clearError, (state) => ({
    ...state,
    error: null,
    successMessage: null,
  }))
);
