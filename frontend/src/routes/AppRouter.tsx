import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";

import Dashboard from "@/pages/dashboard/Dashboard";
import Products from "@/pages/products/Products";
import Inventory from "@/pages/inventory/Inventory";
import Transactions from "@/pages/transactions/Transactions";
import NotFound from "@/pages/not-found/NotFound";
import Settings from "@/pages/settings/Settings";
import Login from "@/pages/auth/Login";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public */}
                <Route path="/login" element={<Login />} />

                {/* Protected */}
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}