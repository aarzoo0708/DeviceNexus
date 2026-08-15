import { createBrowserRouter } from "react-router";

import AppLayout from "./components/layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import AddCustomer from "./pages/AddCustomer";
import CustomerDetails from "./pages/CustomerDetails";
import Devices from "./pages/Devices";
import ServiceRequests from "./pages/ServiceRequests";
import Repairs from "./pages/Repairs";
import Warranty from "./pages/Warranty";
import FollowUps from "./pages/FollowUps";
import Interactions from "./pages/Interactions";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,

    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "customers",
        Component: Customers,
      },
      {
        path: "customers/add",
        Component: AddCustomer,
      },
      {
        path: "customers/:id",
        Component: CustomerDetails,
      },
      {
        path: "devices",
        Component: Devices,
      },
      {
        path: "service-requests",
        Component: ServiceRequests,
      },
      {
        path: "repairs",
        Component: Repairs,
      },
      {
        path: "warranty",
        Component: Warranty,
      },
      {
        path: "follow-ups",
        Component: FollowUps,
      },
      {
        path: "interactions",
        Component: Interactions,
      },
      {
        path: "settings",
        Component: Settings,
      },
      {
        path: "profile",
        Component: Profile,
      },
    ],
  },

  {
    path: "*",
    Component: NotFound,
  },
]);

export default router;