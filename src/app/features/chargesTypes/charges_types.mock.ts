export interface ChargeType {
  id: string;
  code: string;
  description: string;
  category: string;
  defaultAmount: number;
  taxable: boolean;
  taxRate: number | null;
  status: "active" | "inactive";
}

// TODO: Datos de prueba
export const mockChargeTypesData: ChargeType[] = [
  {
    id: "1",
    code: "CT-001",
    description: "charge_types.items.property_tax_residential",
    category: "dashboard.top_transactions.taxes",
    defaultAmount: 5000,
    taxable: true,
    taxRate: 16,
    status: "active",
  },
  {
    id: "2",
    code: "CT-002",
    description: "charge_types.items.water_consumption",
    category: "dashboard.top_transactions.services",
    defaultAmount: 12000,
    taxable: true,
    taxRate: 16,
    status: "active",
  },
  {
    id: "3",
    code: "CT-003",
    description: "charge_types.items.electricity_consumption",
    category: "dashboard.top_transactions.services",
    defaultAmount: 3500,
    taxable: true,
    taxRate: 16,
    status: "active",
  },
  {
    id: "4",
    code: "CT-004",
    description: "charge_types.items.gas_consumption",
    category: "dashboard.top_transactions.services",
    defaultAmount: 2200,
    taxable: true,
    taxRate: 16,
    status: "active",
  },
  {
    id: "5",
    code: "CT-005",
    description: "charge_types.items.traffic_violation_speeding",
    category: "dashboard.top_transactions.fines",
    defaultAmount: 2200,
    taxable: false,
    taxRate: null,
    status: "active",
  },
  {
    id: "6",
    code: "CT-006",
    description: "charge_types.items.building_permit_commercial",
    category: "dashboard.top_transactions.permits",
    defaultAmount: 12000,
    taxable: false,
    taxRate: null,
    status: "active",
  },
];
