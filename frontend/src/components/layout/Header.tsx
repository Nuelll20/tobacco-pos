import { Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">
                    Dashboard
                </h2>

                <div className="hidden md:block">
                    <Input
                        placeholder="Cari produk..."
                        className="w-72"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                >
                    <Bell className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">
                        Admin
                    </span>
                </div>
            </div>
        </header>
    );
}