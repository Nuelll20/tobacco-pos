import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";

import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/dashboard/Dashboard";
import Inventory from "@/pages/inventory/Inventory";
import NotFound from "@/pages/not-found/NotFound";
import Products from "@/pages/products/Products";
import SalesReports from "@/pages/reports/SalesReports";
import Settings from "@/pages/settings/Settings";
import Suppliers from "@/pages/suppliers/Suppliers";
import Transactions from "@/pages/transactions/Transactions";
import GuestRoute from "@/routes/GuestRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={<Login />}
            />
          </Route>
        </Route>

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/inventory"
              element={<Inventory />}
            />

            <Route
              path="/suppliers"
              element={<Suppliers />}
            />

            <Route
              path="/transactions"
              element={<Transactions />}
            />

            <Route
              path="/reports/sales"
              element={<SalesReports />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />
          </Route>
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
}
