import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menus = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Products",
    icon: Package,
    href: "/products",
  },
  {
    title: "Inventory",
    icon: Boxes,
    href: "/inventory",
  },
  {
    title: "Transactions",
    icon: ShoppingCart,
    href: "/transactions",
  },
  {
    title: "Reports",
    icon: BarChart3,
    href: "/reports/sales",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-background">
      <div className="border-b p-6">
        <h1 className="text-xl font-bold">
          Tobacco POS
        </h1>
      </div>

      <nav className="space-y-1 p-3">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.title}
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

              {menu.title}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
