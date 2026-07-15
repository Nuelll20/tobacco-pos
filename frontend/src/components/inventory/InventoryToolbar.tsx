import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InventoryToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddMovement: () => void;
}

export default function InventoryToolbar({
  search,
  onSearchChange,
  onAddMovement,
}: InventoryToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Inventory
        </h1>

        <p className="text-sm text-muted-foreground">
          Track stock in, stock out, adjustments, and movement history.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search product, SKU, or reference..."
          className="w-full sm:w-80"
        />

        <Button
          type="button"
          onClick={onAddMovement}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Movement
        </Button>
      </div>
    </div>
  );
}