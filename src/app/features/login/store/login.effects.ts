import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { map, catchError, switchMap, tap } from "rxjs/operators";
import { LoginService } from "@features/login/services/login.service";
import { TokenRepositoryService } from "@app/core/services/token-repository.service";
import { MockUsersService } from "@app/core/services/mock-users.service";
import * as LoginActions from "./login.actions";
import { User } from "@features/login/models/user.model";
import { UserRole } from "@app/commons/enum/user_role";

@Injectable()
export class LoginEffects {
  private actions$ = inject(Actions);
  private loginService = inject(LoginService);
  private tokenRepository = inject(TokenRepositoryService);
  private mockUsersService = inject(MockUsersService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginActions.loginRequest),
      switchMap(({ email, password, rememberUser }) => {
        const mockUser = this.mockUsersService.validateCredentials(
          email,
          password,
        );

        if (mockUser) {
          const user: User = {
            email: mockUser.email,
            token: mockUser.token || "mock-token",
            expiration: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
          };

          this.tokenRepository.setToken(
            mockUser.token || "mock-token",
            mockUser.email,
            mockUser.role,
            mockUser.name,
            mockUser.municipalityId,
          );

          if (rememberUser) {
            this.tokenRepository.setRememberedUser(email);
          } else {
            this.tokenRepository.clearRememberedUser();
          }

          return of(
            LoginActions.loginSuccess({
              user,
              message: `Welcome ${mockUser.name}!`,
            }),
          );
        }

        return this.loginService.login({ email, password }).pipe(
          map((response) => {
            const user: User = {
              email: response.data.email,
              token: response.data.token,
              expiration: response.data.expiration,
            };

            const userRole = response.data.role || UserRole.MUNICIPALITY_ADMIN;
            const userName =
              response.data.name || response.data.email.split("@")[0];

            this.tokenRepository.setToken(
              response.data.token,
              response.data.email,
              userRole,
              userName,
              response.data.municipalityId,
            );

            if (rememberUser) {
              this.tokenRepository.setRememberedUser(email);
            } else {
              this.tokenRepository.clearRememberedUser();
            }

            return LoginActions.loginSuccess({
              user,
              message: response.message,
            });
          }),
          catchError((error) => {
            let errorMessage = "login.error_generic";

            if (error?.status === 401) {
              errorMessage = "login.error_invalid_credentials";
            } else if (error?.status === 403) {
              errorMessage = "login.error_unauthorized";
            } else if (error?.status >= 500) {
              errorMessage = "login.error_server";
            } else if (error?.status === 0) {
              errorMessage = "login.error_network";
            } else if (error?.error?.message) {
              errorMessage = error.error.message;
            }

            return of(LoginActions.loginFailure({ error: errorMessage }));
          }),
        );
      }),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LoginActions.loginSuccess),
        tap(() => {
          const userRole = this.tokenRepository.getUserRole();

          if (userRole === UserRole.SUPER_ADMIN) {
            this.router.navigate(["/super-admin-portal"]);
          } else {
            this.router.navigate(["/home"]);
          }
        }),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LoginActions.logout),
        tap(() => {
          this.tokenRepository.clearAuthData();

          this.router.navigate(["/login"]);
        }),
      ),
    { dispatch: false },
  );
}
