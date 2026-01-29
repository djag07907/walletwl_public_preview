import { ErrorHandler, Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private router = inject(Router);

  handleError(error: any): void {
    if (
      error?.message?.includes("Cannot match any routes") ||
      error?.message?.includes("CANNOT GET") ||
      error?.status === 404
    ) {
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

        this.router.navigate(["/login"]).catch((navError) => {
          // TODO: Implementar un fallback navigation
        });

        return;
      }
    }

    if (
      error?.message?.includes("ChunkLoadError") ||
      error?.message?.includes("Loading chunk")
    ) {
      window.location.reload();
      return;
    }

    // TODO: Implementar un manejo de errores no controlados
  }
}
