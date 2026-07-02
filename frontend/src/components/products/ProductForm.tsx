import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  productSchema,
  type ProductFormData,
} from "@/schemas/product";

import { getErrorMessage } from "@/lib/error";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateProduct } from "@/hooks/useCreateProduct";


type ProductFormProps = {
  onSuccess?: () => void;
};

export default function ProductForm({
  onSuccess,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),

    defaultValues: {
      sku: "",
      name: "",
      purchase_price: 0,
      selling_price: 0,
      stock: 0,
      minimum_stock: 0,
      is_active: true,
    },
  });
  const createProductMutation = useCreateProduct();

  const isActive = watch("is_active");

  const onSubmit = (data: ProductFormData) => {
    createProductMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Product created successfully");

        reset();

        onSuccess?.();
      },

      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
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

      {/* Active */}
      <div className="flex items-center gap-3">
        <Checkbox
          checked={isActive}
          onCheckedChange={(checked) =>
            setValue("is_active", checked === true)
          }
        />

        <Label>Active</Label>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={createProductMutation.isPending}
      >
        {createProductMutation.isPending
          ? "Saving..."
          : "Save Product"}
      </Button>
    </form>
  );
}