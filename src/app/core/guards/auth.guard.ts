import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { TokenRepositoryService } from "@services/token-repository.service";
import * as LoginActions from "@app/features/login/store/login.actions";

const DEBUG_SIMULATE_ERRORS = false;

const simulateError = (type: string) => {
  if (!DEBUG_SIMULATE_ERRORS) return;
  throw new Error(`Simulated ${type} error`);
};

const handleNavigationError = (router: Router, error?: any) => {
  try {
    window.location.href = "/login";
  } catch (locationError) {
    // TODO: Implementar un fallback navigation
  }
};

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenRepository = inject(TokenRepositoryService);
  const store = inject(Store);

  try {
    if (!tokenRepository.isValidToken()) {
      throw new Error("Token not found or expired");
    }

    tokenRepository.refreshTokenTimestamp();

    return true;
  } catch (error) {
    tokenRepository.clearAuthData();
    store.dispatch(LoginActions.logout());

    router
      .navigate(["/login"])
      .catch((navError) => handleNavigationError(router, navError));

    return false;
  }
};

/**
 * @deprecated Usar TokenRepositoryService en vez de AuthService
 * Esta clase se mantiene por compatibilidad, pero se recomienda usar TokenRepositoryService directamente post-ajustes
 */
export class AuthService {
  constructor(
    private router: Router,
    private tokenRepository: TokenRepositoryService
  ) {}

  isAuthenticated(): boolean {
    return this.tokenRepository.isValidToken();
  }

  login(token: string, username: string): void {
    if (!token || token.trim() === "")
      throw new Error("Login failed: Invalid token");
    if (!username || username.trim() === "")
      throw new Error("Login failed: Invalid username");

    this.tokenRepository.setToken(token.trim(), username.trim());
  }

  logout(): void {
    this.tokenRepository.clearAuthData();
    this.router.navigate(["/login"]).catch((navError) => {
      try {
        window.location.href = "/login";
      } catch (locationError) {
        // TODO: Implementar un fallback navigation
      }
    });
  }

  refreshToken(): void {
    this.tokenRepository.refreshTokenTimestamp();
  }

  getUsername(): string | null {
    return this.tokenRepository.getUserEmail();
  }

  getTokenAge(): number {
    return this.tokenRepository.getTokenAge();
  }
}
