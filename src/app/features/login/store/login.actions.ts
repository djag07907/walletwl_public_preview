import { createAction, props } from "@ngrx/store";
import { User } from "@features/login/models/user.model";

export const loginRequest = createAction(
  "[Login] Login Request",
  props<{ email: string; password: string; rememberUser: boolean }>()
);

export const loginSuccess = createAction(
  "[Login] Login Success",
  props<{ user: User; message: string }>()
);

export const loginFailure = createAction(
  "[Login] Login Failure",
  props<{ error: string }>()
);

export const logout = createAction("[Login] Logout");

export const clearError = createAction("[Login] Clear Error");
