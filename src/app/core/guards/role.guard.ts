import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { UserRole } from "@app/commons/enum/user_role";
import { TokenRepositoryService } from "@services/token-repository.service";

export const superAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenRepository = inject(TokenRepositoryService);

  const userRole = tokenRepository.getUserRole();

  if (userRole === UserRole.SUPER_ADMIN) {
    return true;
  }

  router.navigate(["home"]);
  return false;
};

export const municipalityGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenRepository = inject(TokenRepositoryService);

  const userRole = tokenRepository.getUserRole();

  if (
    userRole === UserRole.MUNICIPALITY_ADMIN ||
    userRole === UserRole.MANAGER
  ) {
    return true;
  }

  if (userRole === UserRole.SUPER_ADMIN) {
    router.navigate(["super-admin-portal"]);
    return false;
  }
  router.navigate(["/login"]);
  return false;
};
