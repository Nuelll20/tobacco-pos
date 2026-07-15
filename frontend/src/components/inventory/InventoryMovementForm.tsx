import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/error";

import { useProducts } from "@/hooks/useProducts";
import { useCreateInventoryMovement } from "@/hooks/useCreateInventoryMovement";

import {
  inventoryMovementSchema,
  type InventoryMovementFormData,
} from "@/schemas/inventory";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type InventoryMovementFormProps = {
  onSuccess?: () => void;
};

export default function InventoryMovementForm({
  onSuccess,
}: InventoryMovementFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InventoryMovementFormData>({
    resolver: zodResolver(inventoryMovementSchema),
    defaultValues: {
      product_id: 0,
      type: "stock_in",
      quantity: 1,
      reference_no: "",
      note: "",
    },
  });

  const { data: productsData, isLoading: isProductsLoading } =
    useProducts({
      per_page: 50,
      sort_by: "name",
      sort_direction: "asc",
    });

  const createInventoryMovementMutation =
    useCreateInventoryMovement();

  const isSaving = createInventoryMovementMutation.isPending;

  const onSubmit = (data: InventoryMovementFormData) => {
    createInventoryMovementMutation.mutate(
      {
        product_id: data.product_id,
        type: data.type,
        quantity: data.quantity,
        reference_no: data.reference_no || null,
        note: data.note || null,
      },
      {
        onSuccess: () => {
          toast.success("Inventory movement created successfully.");

          reset({
            product_id: 0,
            type: "stock_in",
            quantity: 1,
            reference_no: "",
            note: "",
          });

          onSuccess?.();
        },

        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="product_id">Product</Label>

          <select
            id="product_id"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            disabled={isProductsLoading || isSaving}
            {...register("product_id", {
              valueAsNumber: true,
            })}
          >
            <option value={0}>
              {isProductsLoading
                ? "Loading products..."
                : "Select product"}
            </option>

            {(productsData?.data ?? []).map((product) => (
              <option
                key={product.id}
                value={product.id}
              >
                {product.name} — {product.sku} — Stock: {product.stock}
              </option>
            ))}
          </select>

          {errors.product_id && (
            <p className="text-sm text-destructive">
              {errors.product_id.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Movement Type</Label>

          <select
            id="type"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            disabled={isSaving}
            {...register("type")}
          >
            <option value="stock_in">Stock In</option>
            <option value="stock_out">Stock Out</option>
            <option value="adjustment">Adjustment</option>
          </select>

          {errors.type && (
            <p className="text-sm text-destructive">
              {errors.type.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>

          <Input
            id="quantity"
            type="number"
            min={0}
            disabled={isSaving}
            {...register("quantity", {
              valueAsNumber: true,
            })}
          />

          {errors.quantity && (
            <p className="text-sm text-destructive">
              {errors.quantity.message}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="reference_no">Reference No.</Label>

          <Input
            id="reference_no"
            placeholder="Optional reference number"
            disabled={isSaving}
            {...register("reference_no")}
          />

          {errors.reference_no && (
            <p className="text-sm text-destructive">
              {errors.reference_no.message}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="note">Note</Label>

          <textarea
            id="note"
            rows={4}
            placeholder="Optional note"
            disabled={isSaving}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            {...register("note")}
          />

          {errors.note && (
            <p className="text-sm text-destructive">
              {errors.note.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSaving || isProductsLoading}
      >
        {isSaving ? "Saving..." : "Save Movement"}
      </Button>
    </form>
  );
}