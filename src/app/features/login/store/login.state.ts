import { BaseState } from "@app/core/models/base-state.interface";
import { User } from "@features/login/models/user.model";

export interface LoginState extends BaseState {
  user: User | null;
  isAuthenticated: boolean;
  successMessage: string | null;
}

export const initialLoginState: LoginState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  successMessage: null,
};
