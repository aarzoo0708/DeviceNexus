export const mockCustomers = [
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
