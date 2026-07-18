import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type {
  InventoryMovementType,
} from "@/types/inventory";
import type { Product } from "@/types/product";

interface InventoryToolbarProps {
  search: string;
  type: InventoryMovementType | "all";
  productId: number | "all";
  products: Product[];
  isProductsLoading: boolean;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onTypeChange: (
    value: InventoryMovementType | "all",
  ) => void;
  onProductChange: (
    value: number | "all",
  ) => void;
  onResetFilters: () => void;
  onAddMovement: () => void;
}

export default function InventoryToolbar({
  search,
  type,
  productId,
  products,
  isProductsLoading,
  hasActiveFilters,
  onSearchChange,
  onTypeChange,
  onProductChange,
  onResetFilters,
  onAddMovement,
}: InventoryToolbarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t("inventory.title")}
        </h1>

        <p className="text-sm text-muted-foreground">
          {t("inventory.description")}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          value={search}
          placeholder={t(
            "inventory.toolbar.searchPlaceholder",
          )}
          className="w-full sm:w-80"
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
        />

        <select
          value={productId}
          disabled={isProductsLoading}
          aria-label={t(
            "inventory.toolbar.allProducts",
          )}
          className="h-10 rounded-md border bg-background px-3 text-sm"
          onChange={(event) => {
            const value = event.target.value;

            onProductChange(
              value === "all"
                ? "all"
                : Number(value),
            );
          }}
        >
          <option value="all">
            {isProductsLoading
              ? t(
                  "inventory.toolbar.loadingProducts",
                )
              : t(
                  "inventory.toolbar.allProducts",
                )}
          </option>

          {products.map((product) => (
            <option
              key={product.id}
              value={product.id}
            >
              {product.name} - {product.sku}
            </option>
          ))}
        </select>

        <select
          value={type}
          aria-label={t(
            "inventory.toolbar.allTypes",
          )}
          className="h-10 rounded-md border bg-background px-3 text-sm"
          onChange={(event) =>
            onTypeChange(
              event.target.value as
                | InventoryMovementType
                | "all",
            )
          }
        >
          <option value="all">
            {t("inventory.toolbar.allTypes")}
          </option>

          <option value="stock_in">
            {t(
              "inventory.movementTypes.stockIn",
            )}
          </option>

          <option value="stock_out">
            {t(
              "inventory.movementTypes.stockOut",
            )}
          </option>

          <option value="adjustment">
            {t(
              "inventory.movementTypes.adjustment",
            )}
          </option>
        </select>

        <Button
          type="button"
          variant="outline"
          disabled={!hasActiveFilters}
          onClick={onResetFilters}
        >
          {t("inventory.toolbar.reset")}
        </Button>

        <Button
          type="button"
          onClick={onAddMovement}
        >
          <Plus className="mr-2 h-4 w-4" />

          {t("inventory.toolbar.addMovement")}
        </Button>
      </div>
    </div>
  );
}