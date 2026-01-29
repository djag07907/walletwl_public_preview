export interface MunicipalityUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: "active" | "inactive";
}

// TODO: Datos de prueba
export const mockMunicipalityUsersData: MunicipalityUser[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@techcorp.com",
    phone: "+1 234 567 890",
    role: "Admin",
    status: "active",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@techcorp.com",
    phone: "+1 987 654 321",
    role: "Manager",
    status: "active",
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@globallogistics.com",
    phone: "+1 555 123 4567",
    role: "Supervisor",
    status: "active",
  },
  {
    id: "4",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@globallogistics.com",
    phone: "+1 555 987 6543",
    role: "Manager",
    status: "active",
  },
  {
    id: "5",
    firstName: "Robert",
    lastName: "Brown",
    email: "robert.brown@metrodist.com",
    phone: "+1 555 111 2222",
    role: "Manager",
    status: "inactive",
  },
  {
    id: "6",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@metrodist.com",
    phone: "+1 555 333 4444",
    role: "Supervisor",
    status: "active",
  },
];
