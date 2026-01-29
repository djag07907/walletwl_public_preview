export interface BillingRecord {
  id: string;
  citizenName: string;
  recordId: string;
  accountId: string;
  chargeType: string;
  assignedCollectors: string[];
  amount: number;
  status: "paid" | "pending" | "overdue" | "cancelled";
  referenceNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

// TODO: Datos de prueba
export const mockBillingRecordsData: BillingRecord[] = [
  {
    id: "1",
    citizenName: "José Antonio Méndez Morales",
    recordId: "#INV-001",
    accountId: "#ACT-001",
    chargeType: "charge_types.items.subscription",
    assignedCollectors: ["Juan Carlos García", "María Eugenia López"],
    amount: 5000,
    status: "paid",
  },
  {
    id: "2",
    citizenName: "Leticia del Valle Escobedo",
    recordId: "#INV-002",
    accountId: "#ACT-002",
    chargeType: "charge_types.items.one_time",
    assignedCollectors: ["María Eugenia López", "Ricardo Antonio Morales"],
    amount: 12000,
    status: "pending",
  },
  {
    id: "3",
    citizenName: "Ricardo Alfonso Pérez García",
    recordId: "#INV-003",
    accountId: "#ACT-003",
    chargeType: "charge_types.items.maintenance",
    assignedCollectors: ["Juan Carlos García"],
    amount: 3500,
    status: "overdue",
  },
  {
    id: "4",
    citizenName: "Juana Inés de la Cruz Paz",
    recordId: "#INV-004",
    accountId: "#ACT-004",
    chargeType: "charge_types.items.subscription",
    assignedCollectors: ["María Eugenia López"],
    amount: 2200,
    status: "cancelled",
  },
  {
    id: "5",
    citizenName: "Gloria Esperanza Ortiz",
    recordId: "#INV-005",
    accountId: "#ACT-005",
    chargeType: "charge_types.items.consulting",
    assignedCollectors: ["Ana Leticia Ramos"],
    amount: 8900,
    status: "paid",
  },
  {
    id: "6",
    citizenName: "Carlos Enrique Rodas",
    recordId: "#INV-006",
    accountId: "#ACT-006",
    chargeType: "charge_types.items.subscription",
    assignedCollectors: ["Luis Pedro González"],
    amount: 6700,
    status: "pending",
  },
  {
    id: "7",
    citizenName: "Marta Isabel Cabrera",
    recordId: "#INV-007",
    accountId: "#ACT-007",
    chargeType: "charge_types.items.one_time",
    assignedCollectors: ["Juan Carlos García"],
    amount: 15000,
    status: "overdue",
  },
  {
    id: "8",
    citizenName: "Patricia Noemí Aguilar",
    recordId: "#INV-008",
    accountId: "#ACT-008",
    chargeType: "charge_types.items.maintenance",
    assignedCollectors: ["María Eugenia López"],
    amount: 4200,
    status: "cancelled",
  },
  {
    id: "9",
    citizenName: "Luis Fernando Castillo",
    recordId: "#INV-009",
    accountId: "#ACT-009",
    chargeType: "charge_types.items.subscription",
    assignedCollectors: ["Ricardo Antonio Morales"],
    amount: 7800,
    status: "paid",
  },
  {
    id: "10",
    citizenName: "Claudia Victoria Fuentes",
    recordId: "#INV-010",
    accountId: "#ACT-010",
    chargeType: "charge_types.items.consulting",
    assignedCollectors: ["Ana Leticia Ramos"],
    amount: 9500,
    status: "paid",
  },
  {
    id: "11",
    citizenName: "Héctor Rolando Solís",
    recordId: "#INV-011",
    accountId: "#ACT-011",
    chargeType: "charge_types.items.subscription",
    assignedCollectors: ["Luis Pedro González"],
    amount: 3100,
    status: "paid",
  },
  {
    id: "12",
    citizenName: "Sofía Alejandra Guzmán",
    recordId: "#INV-012",
    accountId: "#ACT-012",
    chargeType: "charge_types.items.one_time",
    assignedCollectors: ["Juan Carlos García"],
    amount: 11000,
    status: "pending",
  },
];
