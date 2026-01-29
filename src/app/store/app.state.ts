import { LoginState } from "@app/features/login/store/login.state";

/**
 * Estado global de la aplicación
 */
export interface AppState {
  login: LoginState;
  // Agregar otros estados de características aquí
}
