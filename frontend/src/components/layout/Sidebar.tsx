import { LayoutDashboard, Package, Boxes, ShoppingCart, Settings } from "lucide-react";

const menus = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Products",
        icon: Package,
    },
    {
        title: "Inventory",
        icon: Boxes,
    },
    {
        title: "Transactions",
        icon: ShoppingCart,
    },
    {
        title: "Settings",
        icon: Settings,
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
                        <button
                            key={menu.title}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-muted"
                        >
                            <Icon className="h-5 w-5" />
                            {menu.title}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}