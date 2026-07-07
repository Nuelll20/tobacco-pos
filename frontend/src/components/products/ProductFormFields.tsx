import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import type { ProductFormData } from "@/schemas/product";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type ProductFormFieldsProps = {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  watch: UseFormWatch<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
};

export default function ProductFormFields({
  register,
  errors,
  watch,
  setValue,
}: ProductFormFieldsProps) {
  const isActive = watch("is_active");

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {/* SKU */}
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>

          <Input
            id="sku"
            placeholder="SKU001"
            {...register("sku")}
          />

          {errors.sku && (
            <p className="text-sm text-destructive">
              {errors.sku.message}
            </p>
          )}
        </div>

        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>

          <Input
            id="name"
            placeholder="Gudang Garam Merah"
            {...register("name")}
          />

          {errors.name && (
            <p className="text-sm text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Purchase Price */}
        <div className="space-y-2">
          <Label htmlFor="purchase_price">
            Purchase Price
          </Label>

          <Input
            id="purchase_price"
            type="number"
            {...register("purchase_price", {
              valueAsNumber: true,
            })}
          />

          {errors.purchase_price && (
            <p className="text-sm text-destructive">
              {errors.purchase_price.message}
            </p>
          )}
        </div>

        {/* Selling Price */}
        <div className="space-y-2">
          <Label htmlFor="selling_price">
            Selling Price
          </Label>

          <Input
            id="selling_price"
            type="number"
            {...register("selling_price", {
              valueAsNumber: true,
            })}
          />

          {errors.selling_price && (
            <p className="text-sm text-destructive">
              {errors.selling_price.message}
            </p>
          )}
        </div>

        {/* Stock */}
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>

          <Input
            id="stock"
            type="number"
            {...register("stock", {
              valueAsNumber: true,
            })}
          />

          {errors.stock && (
            <p className="text-sm text-destructive">
              {errors.stock.message}
            </p>
          )}
        </div>

        {/* Minimum Stock */}
        <div className="space-y-2">
          <Label htmlFor="minimum_stock">
            Minimum Stock
          </Label>

          <Input
            id="minimum_stock"
            type="number"
            {...register("minimum_stock", {
              valueAsNumber: true,
            })}
          />

          {errors.minimum_stock && (
            <p className="text-sm text-destructive">
              {errors.minimum_stock.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Checkbox
          checked={isActive}
          onCheckedChange={(checked) =>
            setValue("is_active", checked === true)
          }
        />

        <Label>Active</Label>
      </div>
    </>
  );
}