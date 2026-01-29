import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from "@angular/core";
import { provideRouter, withNavigationErrorHandler } from "@angular/router";
import {
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser";
import {
  provideHttpClient,
  withInterceptors,
  withFetch,
} from "@angular/common/http";
import { ErrorHandler } from "@angular/core";
import { provideStore } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";
import routes from "app/routes/app.routes";
import { GlobalErrorHandler } from "app/core/handlers/global-error.handler";
import { authInterceptor } from "app/core/interceptors/auth.interceptor";
import { headersInterceptor } from "app/core/interceptors/headers.interceptor";
import { loginReducer } from "app/features/login/store/login.reducer";
import { LoginEffects } from "app/features/login/store/login.effects";
import { providePrimeNG } from "primeng/config";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import Lara from "@primeng/themes/lara";
import { provideFirebaseApp, initializeApp } from "@angular/fire/app";
import { provideAuth, getAuth } from "@angular/fire/auth";
import { provideFirestore, getFirestore } from "@angular/fire/firestore";
import { FIREBASE_CONFIG } from "./config/firebase.config";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withNavigationErrorHandler((error) => {
        const token = localStorage.getItem("auth_token");
        const timestamp = localStorage.getItem("auth_token_timestamp");
        const tokenExpirationTime = 5 * 60 * 1000; // 5 minutos

        if (
          !token ||
          !timestamp ||
          Date.now() - parseInt(timestamp) > tokenExpirationTime
        ) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_token_timestamp");
          localStorage.removeItem("user_name");
          localStorage.removeItem("user_role");
          localStorage.removeItem("user_full_name");
          localStorage.removeItem("user_municipality_id");

          window.location.href = "/login";
        }
      }),
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withInterceptors([headersInterceptor, authInterceptor]),
      withFetch(),
    ),
    provideStore({ login: loginReducer }),
    provideEffects([LoginEffects]),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          prefix: "p",
          darkModeSelector: ".dark-mode",
          cssLayer: false,
        },
      },
    }),
    ConfirmationService,
    MessageService,
    DialogService,
    provideFirebaseApp(() => initializeApp(FIREBASE_CONFIG)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
