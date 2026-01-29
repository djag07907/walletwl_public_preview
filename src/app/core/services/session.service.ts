import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { emptyString } from "@app/resources/constants";
import { BehaviorSubject, interval, Subscription, EMPTY } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class SessionService {
  private router = inject(Router);

  private readonly tokenExpirationTime = 5 * 60 * 1000; // 5 minutes
  private readonly checkInterval = 30 * 1000; // every 30 seconds
  private readonly MAX_ERRORS = 5;

  private sessionCheckSubscription?: Subscription;
  private isInitialized = false;
  private errorCount = 0;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    try {
      this.initializeSession();
    } catch (error) {
      this.handleCriticalError(error, "constructor");
    }
  }

  private initializeSession(): void {
    if (this.isInitialized) return;

    try {
      this.checkAuthenticationStatus();
      this.startSessionMonitoring();
      this.isInitialized = true;
    } catch (error) {
      this.handleCriticalError(error, "initializeSession");
    }
  }

  private startSessionMonitoring(): void {
    if (this.sessionCheckSubscription) {
      this.sessionCheckSubscription.unsubscribe();
    }

    this.sessionCheckSubscription = interval(this.checkInterval)
      .pipe(
        catchError((error) => {
          this.handleCriticalError(error, "startSessionMonitoring");
          return EMPTY;
        }),
      )
      .subscribe({
        next: () => {
          try {
            this.checkAuthenticationStatus();
          } catch (error) {
            this.handleCriticalError(error, "checkAuthenticationStatus");
          }
        },
        error: (error) => {
          this.handleCriticalError(error, "sessionMonitoringSubscription");
        },
      });
  }

  private checkAuthenticationStatus(): void {
    try {
      const isValid = this.isValidToken();
      this.safeSetAuthStatus(isValid);

      if (!isValid && this.isOnProtectedRoute()) {
        this.handleSessionExpiration();
      }
    } catch (error) {
      this.handleCriticalError(error, "checkAuthenticationStatus");
      this.safeSetAuthStatus(false);
    }
  }

  private isValidToken(): boolean {
    if (!this.isLocalStorageAvailable()) return false;

    try {
      const token = this.safeGetItem("auth_token");
      const timestampStr = this.safeGetItem("auth_token_timestamp");

      if (!token || !timestampStr) return false;

      const timestamp = this.safeParseInt(timestampStr);
      const tokenAge = Date.now() - timestamp;

      return tokenAge <= this.tokenExpirationTime;
    } catch (error) {
      return false;
    }
  }

  private isOnProtectedRoute(): boolean {
    const url = this.router.url;
    return url.startsWith("/home") || url.includes("dashboard");
  }

  private handleSessionExpiration(): void {
    this.clearAuthData();
    this.router.navigate(["/login"]).catch((err) => {
      try {
        window.location.href = "/login";
      } catch (fallbackErr) {
        // TODO: Implementar notificación al sistema de monitoreo/administrador
      }
    });
  }

  private clearAuthData(): void {
    this.safeRemoveItem("auth_token");
    this.safeRemoveItem("auth_token_timestamp");
    this.safeRemoveItem("user_name");
    this.safeRemoveItem("user_role");
    this.safeRemoveItem("user_full_name");
    this.safeRemoveItem("user_municipality_id");
  }

  public isAuthenticated(): boolean {
    return this.isValidToken();
  }

  public login(token: string, username: string): void {
    try {
      if (!token || !username) {
        throw new Error("Invalid token or username provided for login");
      }

      if (!this.isLocalStorageAvailable()) {
        throw new Error("localStorage not available during login");
      }

      const now = Date.now().toString();

      if (!this.safeSetItem("auth_token", token))
        throw new Error("Failed to store token");
      if (!this.safeSetItem("auth_token_timestamp", now))
        throw new Error("Failed to store timestamp");
      if (!this.safeSetItem("user_name", username))
        throw new Error("Failed to store username");

      this.safeSetAuthStatus(true);
    } catch (error) {
      this.clearAuthData();
      this.safeSetAuthStatus(false);
    }
  }

  public logout(): void {
    this.clearAuthData();
    this.safeSetAuthStatus(false);
    this.router.navigate(["/login"]).catch((err) => {
      try {
        window.location.href = "/login";
      } catch (fallbackErr) {
        // TODO: Implementar notificación al sistema de monitoreo/administrador
      }
    });
  }

  public refreshToken(): void {
    if (!this.isValidToken()) return;

    const now = Date.now().toString();
    this.safeSetItem("auth_token_timestamp", now);
  }

  public getUsername(): string | null {
    return this.safeGetItem("user_name");
  }

  public getRole(): string | null {
    return this.safeGetItem("user_role");
  }

  public getUserFullName(): string | null {
    return this.safeGetItem("user_full_name");
  }

  public getUserEmail(): string | null {
    return this.getUsername();
  }

  public getMunicipalityId(): string | null {
    return this.safeGetItem("user_municipality_id");
  }

  public getTokenAge(): number {
    try {
      const timestampStr = this.safeGetItem("auth_token_timestamp");
      const timestamp = this.safeParseInt(timestampStr ?? emptyString);
      return Date.now() - timestamp;
    } catch {
      return 0;
    }
  }

  public getRemainingTime(): number {
    const tokenAge = this.getTokenAge();
    return Math.max(0, this.tokenExpirationTime - tokenAge);
  }

  public destroy(): void {
    if (this.sessionCheckSubscription) {
      this.sessionCheckSubscription.unsubscribe();
    }
  }

  private safeSetAuthStatus(status: boolean) {
    try {
      this.isAuthenticatedSubject.next(status);
    } catch (error) {
      // TODO: Implementar notificación al sistema de monitoreo/administrador
    }
  }

  private handleCriticalError(error: any, context: string) {
    this.errorCount++;

    if (this.errorCount >= this.MAX_ERRORS) {
      this.isAuthenticatedSubject.complete();
      this.destroy();

      // TODO: Implementar notificación al sistema de monitoreo/administrador
    }
  }

  private isLocalStorageAvailable(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined"
    );
  }

  private safeSetItem(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  private safeGetItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  private safeRemoveItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      // TODO: Implementar notificación al sistema de monitoreo/administrador
    }
  }

  private safeParseInt(value: string): number {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      throw new Error(`Invalid number format: ${value}`);
    }
    return parsed;
  }
}
