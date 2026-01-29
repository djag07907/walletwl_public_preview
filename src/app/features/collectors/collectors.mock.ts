export interface Collector {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedMunicipalities: string[];
  image: string;
  lastActivity: string[];
  role: string;
  status: "active" | "inactive" | "suspended";
}

// TODO: Datos de prueba
export const mockCollectorsData: Collector[] = [
  {
    id: "#CL-0001",
    name: "Juan Carlos García",
    email: "juan.garcia@gmail.com",
    phone: "55554433",
    assignedMunicipalities: ["Guatemala"],
    image: "",
    lastActivity: ["", ""],
    role: "collector",
    status: "active",
  },
  {
    id: "#CL-0002",
    name: "María Eugenia López",
    email: "m.lopez@gmail.com",
    phone: "44332211",
    assignedMunicipalities: ["Mixco"],
    image: "",
    lastActivity: ["1", "1"],
    role: "collector",
    status: "active",
  },
  {
    id: "#CL-0003",
    name: "Ricardo Antonio Morales",
    email: "ricardo.morales@gmail.com",
    phone: "55667788",
    assignedMunicipalities: ["Villa Nueva"],
    image: "",
    lastActivity: ["2", "2"],
    role: "collector",
    status: "active",
  },
  {
    id: "#CL-0004",
    name: "Ana Leticia Ramos",
    email: "ana.ramos@gmail.com",
    phone: "99999944",
    assignedMunicipalities: ["Sprield"],
    image: "",
    lastActivity: ["4", "4"],
    role: "collector",
    status: "inactive",
  },
  {
    id: "#CL-0005",
    name: "Luis Pedro González",
    email: "luis.gonzalez@gmail.com",
    phone: "99999959",
    assignedMunicipalities: ["Springfield"],
    image: "",
    lastActivity: ["5", "5"],
    role: "collector",
    status: "suspended",
  },
  {
    id: "#CL-0006",
    name: "John Doe",
    email: "john.doe@gmail.com",
    phone: "99999999",
    assignedMunicipalities: ["Springfield"],
    image: "",
    lastActivity: ["", ""],
    role: "collector",
    status: "active",
  },
  {
    id: "#CL-0007",
    name: "John Doe",
    email: "john.doe@gmail.com",
    phone: "99999999",
    assignedMunicipalities: ["Springfield"],
    image: "",
    lastActivity: ["", ""],
    role: "collector",
    status: "active",
  },
  {
    id: "#CL-0008",
    name: "John Doe",
    email: "john.doe@gmail.com",
    phone: "99999999",
    assignedMunicipalities: ["Springfield"],
    image: "",
    lastActivity: ["", ""],
    role: "collector",
    status: "suspended",
  },
];
