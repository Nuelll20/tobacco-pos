import { Plus } from "lucide-react";

import type { InventoryMovementType } from "@/types/inventory";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InventoryToolbarProps {
  search: string;
  type: InventoryMovementType | "all";
  onSearchChange: (value: string) => void;
  onTypeChange: (value: InventoryMovementType | "all") => void;
  onAddMovement: () => void;
}

export default function InventoryToolbar({
  search,
  type,
  onSearchChange,
  onTypeChange,
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

        <select
          value={type}
          onChange={(event) =>
            onTypeChange(
              event.target.value as InventoryMovementType | "all"
            )
          }
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All Types</option>
          <option value="stock_in">Stock In</option>
          <option value="stock_out">Stock Out</option>
          <option value="adjustment">Adjustment</option>
        </select>

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