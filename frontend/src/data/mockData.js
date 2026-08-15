export const INITIAL_CUSTOMERS = [
  {
    id: "CUST-001",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    devices: 3,
    status: "Active",
    joinedDate: "12 Aug 2026",
    registeredDevices: [
      { id: "DEV-101", name: "Dell XPS 15", type: "Laptop", status: "Active", warranty: "Valid" },
      { id: "DEV-102", name: "iPhone 15", type: "Smartphone", status: "Active", warranty: "Valid" },
      { id: "DEV-103", name: "iPad Pro", type: "Tablet", status: "Inactive", warranty: "Expired" }
    ],
    serviceHistory: [
      { id: "REQ-1024", issue: "Keyboard not working", device: "Dell XPS 15", status: "In Progress", priority: "High" }
    ]
  },
  {
    id: "CUST-002",
    name: "Priya Kapoor",
    email: "priya@example.com",
    phone: "9812345678",
    devices: 2,
    status: "Active",
    joinedDate: "10 Aug 2026",
    registeredDevices: [
      { id: "DEV-104", name: "MacBook Pro M2", type: "Laptop", status: "Active", warranty: "Expired" },
      { id: "DEV-105", name: "Apple Watch Series 9", type: "Wearable", status: "Active", warranty: "Valid" }
    ],
    serviceHistory: [
      { id: "REQ-1018", issue: "Battery replacement", device: "MacBook Pro M2", status: "Resolved", priority: "Medium" }
    ]
  },
  {
    id: "CUST-003",
    name: "Amit Patel",
    email: "amit@example.com",
    phone: "9823456789",
    devices: 1,
    status: "Pending",
    joinedDate: "14 Aug 2026",
    registeredDevices: [
      { id: "DEV-106", name: "Samsung Galaxy S23", type: "Smartphone", status: "Active", warranty: "Valid" }
    ],
    serviceHistory: []
  },
  {
    id: "CUST-004",
    name: "Sneha Desai",
    email: "sneha@example.com",
    phone: "9834567890",
    devices: 4,
    status: "Active",
    joinedDate: "05 Aug 2026",
    registeredDevices: [
      { id: "DEV-107", name: "Lenovo ThinkPad", type: "Laptop", status: "Active", warranty: "Valid" },
      { id: "DEV-108", name: "AirPods Pro", type: "Audio", status: "Active", warranty: "Valid" },
      { id: "DEV-109", name: "Kindle Paperwhite", type: "E-Reader", status: "Active", warranty: "Expired" },
      { id: "DEV-110", name: "Google Pixel 8", type: "Smartphone", status: "Inactive", warranty: "Expired" }
    ],
    serviceHistory: []
  },
  {
    id: "CUST-005",
    name: "Vikram Singh",
    email: "vikram@example.com",
    phone: "9845678901",
    devices: 0,
    status: "Inactive",
    joinedDate: "01 Aug 2026",
    registeredDevices: [],
    serviceHistory: []
  }
];

export const INITIAL_DEVICES = [
  {
    id: "DEV-1001",
    name: 'MacBook Pro 16"',
    model: "Apple M2 Max (32GB / 1TB)",
    customer: "Acme Corp",
    type: "Laptop",
    status: "Active",
    warranty: "Active",
    serialNumber: "C02FX390MD6R",
    purchaseDate: "2024-01-15",
  },
  {
    id: "DEV-1002",
    name: "iPhone 15 Pro",
    model: "256GB Natural Titanium",
    customer: "TechStart Inc",
    type: "Smartphone",
    status: "In Repair",
    warranty: "Expiring Soon",
    serialNumber: "F17GL901PQ2A",
    purchaseDate: "2023-09-22",
  },
  {
    id: "DEV-1003",
    name: "Dell XPS 15",
    model: "i9-13900H (32GB / 1TB RTX 4060)",
    customer: "Global Logistics",
    type: "Laptop",
    status: "Active",
    warranty: "Expired",
    serialNumber: "DL-8840192-X",
    purchaseDate: "2022-04-10",
  },
  {
    id: "DEV-1004",
    name: 'iPad Pro 12.9"',
    model: "M2 Cellular 512GB Space Gray",
    customer: "Creative Studio",
    type: "Tablet",
    status: "Inactive",
    warranty: "Active",
    serialNumber: "DMPZ9021LX99",
    purchaseDate: "2023-11-05",
  },
  {
    id: "DEV-1005",
    name: "HP LaserJet Enterprise",
    model: "M608dn Mono Printer",
    customer: "Acme Corp",
    type: "Printer",
    status: "Retired",
    warranty: "Expired",
    serialNumber: "CNB8G31023",
    purchaseDate: "2020-06-18",
  },
  {
    id: "DEV-1006",
    name: "ThinkPad X1 Carbon",
    model: "Gen 11 i7-1365U (16GB / 512GB)",
    customer: "Nexus Health",
    type: "Laptop",
    status: "Active",
    warranty: "Active",
    serialNumber: "PF-4A9011X",
    purchaseDate: "2024-03-01",
  },
  {
    id: "DEV-1007",
    name: "Apple Watch Ultra 2",
    model: "49mm Titanium Case with Ocean Band",
    customer: "TechStart Inc",
    type: "Smartwatch",
    status: "Active",
    warranty: "Expiring Soon",
    serialNumber: "G6VZQ119P0",
    purchaseDate: "2023-10-14",
  },
  {
    id: "DEV-1008",
    name: 'iMac 24"',
    model: "M3 8-Core CPU 16GB",
    customer: "Apex Media",
    type: "Desktop",
    status: "In Repair",
    warranty: "Active",
    serialNumber: "C02J8019M3P",
    purchaseDate: "2024-02-20",
  },
];

// Helper functions for data access & persistence
const DATA_CHANGE_EVENT = "devicenexus-data-change";

export function notifyDataChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(DATA_CHANGE_EVENT));
  }
}

export function onDataChange(callback) {
  if (typeof window !== "undefined") {
    window.addEventListener(DATA_CHANGE_EVENT, callback);
    return () => window.removeEventListener(DATA_CHANGE_EVENT, callback);
  }
  return () => {};
}

export function getCustomers() {
  try {
    const saved = localStorage.getItem("devicenexus-customers");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to parse customers from localStorage", e);
  }
  return INITIAL_CUSTOMERS;
}

export function saveCustomers(customers) {
  try {
    localStorage.setItem("devicenexus-customers", JSON.stringify(customers));
    // Keep exported array reference synced
    mockCustomers.length = 0;
    mockCustomers.push(...customers);
    notifyDataChange();
  } catch (e) {
    console.error("Failed to save customers to localStorage", e);
  }
}

export function addCustomer(customer) {
  const current = getCustomers();
  const updated = [...current, customer];
  saveCustomers(updated);
  return updated;
}

export function getDevices() {
  try {
    const saved = localStorage.getItem("devicenexus-devices");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to parse devices from localStorage", e);
  }
  return INITIAL_DEVICES;
}

export function saveDevices(devices) {
  try {
    localStorage.setItem("devicenexus-devices", JSON.stringify(devices));
    mockDevices.length = 0;
    mockDevices.push(...devices);
    notifyDataChange();
  } catch (e) {
    console.error("Failed to save devices to localStorage", e);
  }
}

export function addDevice(device) {
  const current = getDevices();
  const updated = [...current, device];
  saveDevices(updated);
  return updated;
}

// In-memory exports initialized from storage or defaults
export const mockCustomers = [...getCustomers()];
export const mockDevices = [...getDevices()];

