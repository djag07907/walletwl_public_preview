import { UserRole } from "@app/commons/enum/user_role";

export interface AuthUser {
  email: string;
  role: UserRole;
  name: string;
  token?: string;
  municipalityId?: string;
}
