import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TokenRepositoryService {
  private readonly TOKEN_KEY = "auth_token";
  private readonly TIMESTAMP_KEY = "auth_token_timestamp";
  private readonly USER_KEY = "user_name";
  private readonly USER_ROLE_KEY = "user_role";
  private readonly USER_FULL_NAME_KEY = "user_full_name";
  private readonly USER_MUNICIPALITY_ID_KEY = "user_municipality_id";
  private readonly REMEMBERED_USER_KEY = "remembered_user";
  private readonly TOKEN_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

  private isLocalStorageAvailable(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined"
    );
  }

  private safeSetItem(key: string, value: string): boolean {
    try {
      if (!this.isLocalStorageAvailable()) return false;
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Failed to set ${key} in localStorage:`, error);
      return false;
    }
  }

  private safeGetItem(key: string): string | null {
    try {
      if (!this.isLocalStorageAvailable()) return null;
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to get ${key} from localStorage:`, error);
      return null;
    }
  }

  private safeRemoveItem(key: string): void {
    try {
      if (!this.isLocalStorageAvailable()) return;
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key} from localStorage:`, error);
    }
  }

  setToken(
    token: string,
    email: string,
    role?: string,
    fullName?: string,
    municipalityId?: string,
  ): void {
    if (!token || !email) {
      throw new Error("Token and email are required");
    }

    let success =
      this.safeSetItem(this.TOKEN_KEY, token) &&
      this.safeSetItem(this.TIMESTAMP_KEY, Date.now().toString()) &&
      this.safeSetItem(this.USER_KEY, email);

    if (role) {
      success = success && this.safeSetItem(this.USER_ROLE_KEY, role);
    }

    if (fullName) {
      success = success && this.safeSetItem(this.USER_FULL_NAME_KEY, fullName);
    }

    if (municipalityId) {
      success =
        success &&
        this.safeSetItem(this.USER_MUNICIPALITY_ID_KEY, municipalityId);
    }

    if (!success) {
      this.clearAuthData();
      throw new Error("Failed to store authentication data");
    }
  }

  getToken(): string | null {
    if (!this.isValidToken()) {
      this.clearAuthData();
      return null;
    }
    return this.safeGetItem(this.TOKEN_KEY);
  }

  isValidToken(): boolean {
    const token = this.safeGetItem(this.TOKEN_KEY);
    const timestampStr = this.safeGetItem(this.TIMESTAMP_KEY);

    if (!token || !timestampStr) return false;

    try {
      const timestamp = parseInt(timestampStr, 10);
      if (isNaN(timestamp) || timestamp <= 0) return false;

      const tokenAge = Date.now() - timestamp;
      return tokenAge <= this.TOKEN_EXPIRATION_TIME;
    } catch (error) {
      return false;
    }
  }

  clearAuthData(): void {
    this.safeRemoveItem(this.TOKEN_KEY);
    this.safeRemoveItem(this.TIMESTAMP_KEY);
    this.safeRemoveItem(this.USER_KEY);
    this.safeRemoveItem(this.USER_ROLE_KEY);
    this.safeRemoveItem(this.USER_FULL_NAME_KEY);
    this.safeRemoveItem(this.USER_MUNICIPALITY_ID_KEY);
  }

  refreshTokenTimestamp(): void {
    if (this.isValidToken()) {
      this.safeSetItem(this.TIMESTAMP_KEY, Date.now().toString());
    }
  }

  getUserEmail(): string | null {
    return this.safeGetItem(this.USER_KEY);
  }

  getTokenAge(): number {
    const timestampStr = this.safeGetItem(this.TIMESTAMP_KEY);
    if (!timestampStr) return 0;

    try {
      const timestamp = parseInt(timestampStr, 10);
      if (isNaN(timestamp)) return 0;
      return Date.now() - timestamp;
    } catch (error) {
      return 0;
    }
  }

  setRememberedUser(email: string): void {
    this.safeSetItem(this.REMEMBERED_USER_KEY, email);
  }

  getRememberedUser(): string | null {
    return this.safeGetItem(this.REMEMBERED_USER_KEY);
  }

  clearRememberedUser(): void {
    this.safeRemoveItem(this.REMEMBERED_USER_KEY);
  }

  getUserRole(): string | null {
    return this.safeGetItem(this.USER_ROLE_KEY);
  }

  getUserFullName(): string | null {
    return this.safeGetItem(this.USER_FULL_NAME_KEY);
  }

  getMunicipalityId(): string | null {
    return this.safeGetItem(this.USER_MUNICIPALITY_ID_KEY);
  }
}
