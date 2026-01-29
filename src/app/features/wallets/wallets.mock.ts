export interface Wallet {
  id: string;
  dpi: string;
  assignedUserId: string;
  ownerName?: string;
  accountId: string;
  currentBalance: number;
  initialBalance: number;
  lastTransactionDate: string;
  assignedMunicipalityId: string;
  taxId: string;
  walletType: "personal" | "business" | "departamental";
  notes: string[];
  status: "active" | "inactive" | "suspended";
  createdAt?: string;
}

// TODO: Datos de prueba
export const mockWalletsData: Wallet[] = [
  {
    id: "#WLT-0001",
    dpi: "1234567890101",
    assignedUserId: "#USR-0001",
    ownerName: "John Doe",
    accountId: "#ACT-0001",
    currentBalance: 1250.5,
    initialBalance: 0.0,
    lastTransactionDate: "2022-01-01",
    assignedMunicipalityId: "#MCP-0001",
    taxId: "12345678",
    walletType: "personal",
    notes: ["Note 1", "Note 2"],
    status: "suspended",
  },
  {
    id: "#WLT-0002",
    dpi: "1234567890102",
    assignedUserId: "#USR-0002",
    ownerName: "Jane Smith",
    accountId: "#ACT-0002",
    currentBalance: 3420.0,
    initialBalance: 0.0,
    lastTransactionDate: "2022-01-01",
    assignedMunicipalityId: "#MCP-0002",
    taxId: "12345678",
    walletType: "departamental",
    notes: ["Note 1", "Note 2"],
    status: "inactive",
  },
  {
    id: "#WLT-0003",
    dpi: "1234567890103",
    assignedUserId: "#USR-0003",
    ownerName: "Bob Johnson",
    accountId: "#ACT-0003",
    currentBalance: 750.25,
    initialBalance: 0.0,
    lastTransactionDate: "2022-01-01",
    assignedMunicipalityId: "#MCP-0003",
    taxId: "12345678",
    walletType: "business",
    notes: ["Note 1", "Note 2"],
    status: "active",
  },
];
