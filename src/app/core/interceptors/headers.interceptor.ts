import { HttpInterceptorFn } from "@angular/common/http";
import { AUTH_CONFIG } from "@core/config/api.config";

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const isAuthEndpoint =
    req.url.includes("/users/") || req.url.includes("/Auth");

  if (!isAuthEndpoint) {
    return next(req);
  }

  const clonedRequest = req.clone({
    setHeaders: {
      "Content-Type": "application/json",
      Bundle: AUTH_CONFIG.Bundle,
      SecretKey: AUTH_CONFIG.SecretKey,
      ApiVersion: AUTH_CONFIG.ApiVersion,
    },
  });

  return next(clonedRequest);
};
