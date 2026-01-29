import { Injectable } from "@angular/core";
import { UserRole } from "@app/commons/enum/user_role";
import { AuthUser } from "@app/core/models/user-role.model";

@Injectable({
  providedIn: "root",
})

// TODO: Datos de prueba para test de login por roles
// TODO: Eliminar cuando se tenga el backend
export class MockUsersService {
  private mockUsers: { [email: string]: AuthUser & { password: string } } = {
    "superadmin@municipal.gov": {
      email: "superadmin@municipal.gov",
      password: "admin123!@#",
      name: "Alex Morgan",
      role: UserRole.SUPER_ADMIN,
      token: "mock-token-super-admin-12345",
    },
    "admin@springfield.gov": {
      email: "admin@springfield.gov",
      password: "admin123!@#",
      name: "John Smith",
      role: UserRole.MUNICIPALITY_ADMIN,
      token: "mock-token-municipality-admin-67890",
      municipalityId: "springfield",
    },
    "manager@municipal.gov": {
      email: "manager@municipal.gov",
      password: "manager123!@#",
      name: "Sarah Johnson",
      role: UserRole.MANAGER,
      token: "mock-token-manager-11111",
    },
  };

  validateCredentials(email: string, password: string): AuthUser | null {
    const user = this.mockUsers[email.toLowerCase()];

    if (user && user.password === password) {
      const { password: _, ...userData } = user;
      return userData;
    }

    return null;
  }

  getUserByEmail(email: string): AuthUser | null {
    const user = this.mockUsers[email.toLowerCase()];

    if (user) {
      const { password: _, ...userData } = user;
      return userData;
    }

    return null;
  }

  userExists(email: string): boolean {
    return email.toLowerCase() in this.mockUsers;
  }
}
