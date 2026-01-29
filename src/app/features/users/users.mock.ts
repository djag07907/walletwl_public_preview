import { UserRole } from "@app/commons/enum/user_role";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  municipalityId?: string;
  status: "active" | "inactive";
}

// TODO: Datos de prueba
export const mockUsersData: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@techcorp.com",
    role: UserRole.SUPER_ADMIN,
    municipalityId: "springfield",
    status: "active",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@techcorp.com",
    role: UserRole.MUNICIPALITY_ADMIN,
    municipalityId: "springfield",
    status: "active",
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@globallogistics.com",
    role: UserRole.MANAGER,
    municipalityId: "shelbyville",
    status: "active",
  },
  {
    id: "4",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@globallogistics.com",
    role: UserRole.USER,
    municipalityId: "shelbyville",
    status: "active",
  },
  {
    id: "5",
    firstName: "Robert",
    lastName: "Brown",
    email: "robert.brown@metrodist.com",
    role: UserRole.MANAGER,
    municipalityId: "capital-city",
    status: "inactive",
  },
  {
    id: "6",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@metrodist.com",
    role: UserRole.USER,
    municipalityId: "capital-city",
    status: "active",
  },
];
