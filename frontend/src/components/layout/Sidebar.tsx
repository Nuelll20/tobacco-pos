import {

  BarChart3,
  Boxes,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Truck,
  ShoppingBasket,
  ClipboardCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const menus = [
  {
    titleKey: "navigation.dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    titleKey: "navigation.products",
    icon: Package,
    href: "/products",
  },
  {
    titleKey: "navigation.suppliers",
    icon: Truck,
    href: "/suppliers",
  },
  {
    titleKey: "navigation.purchases",
    href: "/purchases",
    icon: ShoppingBasket,
  },
  {
    titleKey: "navigation.inventory",
    icon: Boxes,
    href: "/inventory",
  },
  {
    titleKey: "navigation.stockOpnames",
    icon: ClipboardCheck,
    href: "/stock-opnames",
  },
  {
    titleKey: "navigation.transactions",
    icon: ShoppingCart,
    href: "/transactions",
  },
  {
    titleKey: "navigation.reports",
    icon: BarChart3,
    href: "/reports/sales",
  },
  {
    titleKey: "navigation.settings",
    icon: Settings,
    href: "/settings",
  },
] as const;

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="w-64 border-r bg-background">
      <div className="border-b p-6">
        <h1 className="text-xl font-bold">
          {t("common.appName")}
        </h1>
      </div>

      <nav className="space-y-1 p-3">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.href}
              to={menu.href}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`
              }
            >
              <Icon className="h-5 w-5" />

              {t(menu.titleKey)}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
