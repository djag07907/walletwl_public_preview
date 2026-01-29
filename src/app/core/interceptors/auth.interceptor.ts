import { HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { TokenRepositoryService } from "@services/token-repository.service";

// TODO: Los TODOS seran agregados posteriormente a un diccionario de errores
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const tokenRepository = inject(TokenRepositoryService);

  let clonedRequest: HttpRequest<any> = req;
  const token = tokenRepository.getToken();

  if (token) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(clonedRequest).pipe(
    catchError((error) => {
      try {
        // Validar que el objeto error existe y tiene las propiedades esperadas
        if (!error || typeof error !== "object") {
          throw new Error("Invalid error object received");
        }

        // Obtener status code de forma segura
        const statusCode = error.status || error.statusCode || 0;
        const errorName = error.name || "Unknown";
        const errorMessage =
          error.message || error.error?.message || "Unknown error";

        // Handlers para tipos de error
        if (statusCode === 401) {
          try {
            clearAuthData();
            router.navigate(["/login"]).catch((navError) => {
              // TODO: Implementar un fallback navigation
              window.location.href = "/login";
            });
          } catch (authError) {
            // TODO: Implementar un manejo de errores para el manejo de 401
          }
          return throwError(() => error);
        }

        if (statusCode === 403) {
          // TODO: Implementar manejo de acceso prohibido
          // TODO: Mostrar mensaje de error "No tienes permisos para acceder a este recurso"
          // TODO: Redirigir al dashboard principal o página de permisos insuficientes
          // TODO: Posiblemente mostrar modal de error con detalles del acceso denegado
          // TODO: Considerar logout automático si el token ha sido revocado
        }

        if (statusCode === 404) {
          try {
            if (!isValidToken()) {
              clearAuthData();
              router.navigate(["/login"]).catch((navError) => {
                window.location.href = "/login";
              });
              return throwError(() => error);
            }
          } catch (tokenError) {
            // Si hay error al validar token, redirigir a login por seguridad
            clearAuthData();
            router
              .navigate(["/login"])
              .catch(() => (window.location.href = "/login"));
            return throwError(() => error);
          }
          // TODO: Implementar manejo de recursos no encontrados
          // TODO: Mostrar mensaje de error "El recurso solicitado no existe"
          // TODO: Redirigir a página 404 personalizada o dashboard
          // TODO: Registrar error 404 para análisis de rutas rotas
        }

        // Handler para errores del servidor
        if (statusCode === 500) {
          // TODO: Implementar manejo de errores del servidor
          // TODO: Mostrar mensaje de error "Error interno del servidor, intenta más tarde"
          // TODO: Implementar sistema de notificación de errores críticos
          // TODO: Registrar error en sistema de logs para monitoreo
          // TODO: Mostrar página de error 500 personalizada
        }

        // Handler para errores de validación
        if (statusCode === 400) {
          // TODO: Implementar manejo de errores de validación
          // TODO: Mostrar errores de validación específicos en formularios
          // TODO: Resaltar campos con errores en la UI
          // TODO: Mostrar mensajes de error descriptivos al usuario
          // TODO: Implementar validación en tiempo real para prevenir errores
        }

        // Handler para errores de timeout
        if (statusCode === 408 || errorName === "TimeoutError") {
          // TODO: Implementar manejo de timeouts
          // TODO: Mostrar mensaje "La solicitud tardó demasiado tiempo"
          // TODO: Ofrecer opción de reintentar la petición
          // TODO: Implementar timeout progresivo (aumentar tiempo en reintentos)
          // TODO: Mostrar indicador de progreso para operaciones largas
        }

        // Handler para errores de servicio no disponible
        if (statusCode === 503) {
          // TODO: Implementar manejo de servicio no disponible
          // TODO: Mostrar mensaje "El servicio está temporalmente no disponible"
          // TODO: Implementar sistema de reintentos automáticos
          // TODO: Mostrar página de mantenimiento personalizada
          // TODO: Notificar al usuario sobre tiempo estimado de recuperación
        }

        // Handler para errores de red
        if (statusCode === 0 || !navigator.onLine) {
          // TODO: Implementar manejo de errores de conexión
          // TODO: Mostrar banner de "Sin conexión a internet"
          // TODO: Implementar modo offline con datos en caché
          // TODO: Mostrar botón de "Reintentar" para reenviar peticiones
          // TODO: Guardar peticiones fallidas en queue para reintentar cuando vuelva la conexión
          // TODO: Mostrar indicador visual de estado de conexión en la UI
        }

        // Handler para errores genéricos no manejados
        // TODO: Implementar logger centralizado para errores no manejados
        // TODO: Mostrar mensaje de error genérico al usuario
        // TODO: Implementar sistema de reportes de errores automático
        // TODO: Considerar mostrar formulario de reporte de problema

        return throwError(() => error);
      } catch (interceptorError) {
        //  TODO: Implementar manejo de errores críticos en el interceptor
        // En caso de error crítico, limpiar datos de autenticación por seguridad
        try {
          clearAuthData();
        } catch (clearError) {
          // TODO: Implementar un método de limpieza alternativo
        }

        // Intentar redirigir a login como último recurso
        try {
          router.navigate(["/login"]).catch((navError) => {
            try {
              window.location.href = "/login";
            } catch (locationError) {
              // TODO: Implementar un fallback navigation
            }
          });
        } catch (routerError) {
          // Si router.navigate falla, intentar redirigir con window.location
          try {
            window.location.href = "/login";
          } catch (locationError) {
            // TODO: Implementar un fallback navigation
          }
        }

        return throwError(() => error || interceptorError);
      }
    })
  );
};

function isValidToken(): boolean {
  try {
    // Verificar disponibilidad de localStorage
    if (typeof Storage === "undefined" || typeof localStorage === "undefined") {
      return false;
    }

    let token: string | null = null;
    let timestamp: string | null = null;

    // Obtener tokens de forma segura
    try {
      token = localStorage.getItem("auth_token");
      timestamp = localStorage.getItem("auth_token_timestamp");
    } catch (storageError) {
      return false;
    }

    if (!token || !timestamp) {
      return false;
    }

    let parsedTimestamp: number;
    try {
      parsedTimestamp = parseInt(timestamp, 10);
      if (isNaN(parsedTimestamp) || parsedTimestamp <= 0) {
        return false;
      }
    } catch (parseError) {
      return false;
    }

    // Verificar expiración
    const tokenExpirationTime = 5 * 60 * 1000; // 5 minutos
    const tokenAge = Date.now() - parsedTimestamp;
    const isValid = tokenAge <= tokenExpirationTime;

    return isValid;
  } catch (error) {
    return false;
  }
}

function clearAuthData(): void {
  try {
    // Verificar disponibilidad de localStorage
    if (typeof Storage === "undefined" || typeof localStorage === "undefined") {
      return;
    }

    const keysToRemove = ["auth_token", "auth_token_timestamp", "user_name"];
    const errors: string[] = [];

    // Limpiar cada key de forma individual para capturar errores específicos
    keysToRemove.forEach((key) => {
      try {
        const existedBefore = localStorage.getItem(key) !== null;
        localStorage.removeItem(key);

        if (existedBefore) {
          // TODO: Implementar notificación de éxito al usuario
        }
      } catch (removeError) {
        errors.push(`${key}: ${removeError}`);
      }
    });
  } catch (error) {
    // TODO: Implementar método de limpieza alternativo si localStorage falla
    // TODO: Considerar limpiar cookies o sessionStorage como respaldo
    // TODO: Notificar al sistema de monitoreo sobre fallas de limpieza críticas
  }
}
