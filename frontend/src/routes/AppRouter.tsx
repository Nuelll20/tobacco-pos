import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";

import Dashboard from "@/pages/dashboard/Dashboard";
import Products from "@/pages/products/Products";
import Inventory from "@/pages/inventory/Inventory";
import Transactions from "@/pages/transactions/Transactions";
import Settings from "@/pages/settings/Settings";
import Login from "@/pages/auth/Login";
import NotFound from "@/pages/not-found/NotFound";
import ProtectedRoute from "@/routes/ProtectedRoute";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                </Route>

                {/* Protected */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/transactions" element={<Transactions />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}