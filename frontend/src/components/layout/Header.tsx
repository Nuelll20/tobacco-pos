import { Bell, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const pageTitleKeys = {
  "/": "navigation.dashboard",
  "/products": "navigation.products",
  "/inventory": "navigation.inventory",
  "/stock-opnames": "navigation.stockOpnames",
  "/transactions": "navigation.transactions",
  "/reports/sales": "navigation.reports",
  "/settings": "navigation.settings",
} as const;

export default function Header() {
  const { t } = useTranslation();
  const location = useLocation();

  const pageTitleKey =
    pageTitleKeys[
      location.pathname as keyof typeof pageTitleKeys
    ] ?? "common.appName";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">
          {t(pageTitleKey)}
        </h2>

        <div className="hidden md:block">
          <Input
            placeholder={t("header.searchProducts")}
            className="w-72"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t("header.notifications")}
        >
          <Bell className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
          <User className="h-4 w-4" />

          <span className="text-sm font-medium">
            {t("header.admin")}
          </span>
        </div>
      </div>
    </header>
  );
}