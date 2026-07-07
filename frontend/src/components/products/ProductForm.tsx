import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import type { Product } from "@/types/product";

import {
  productSchema,
  type ProductFormData,
} from "@/schemas/product";

import { getErrorMessage } from "@/lib/error";

import { useUpdateProduct } from "@/hooks/useUpdateProduct";

import { useCreateProduct } from "@/hooks/useCreateProduct";

import { Button } from "@/components/ui/button";
import ProductFormFields from "@/components/products/ProductFormFields";

type ProductFormProps = {
  product?: Product | null;
  onSuccess?: () => void;
};

export default function ProductForm({
  product,
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
  const updateProductMutation = useUpdateProduct();

  useEffect(() => {
    if (product) {
      reset({
        sku: product.sku,
        name: product.name,
        purchase_price: product.purchase_price,
        selling_price: product.selling_price,
        stock: product.stock,
        minimum_stock: product.minimum_stock,
        is_active: product.is_active,
      });
    } else {
      reset({
        sku: "",
        name: "",
        purchase_price: 0,
        selling_price: 0,
        stock: 0,
        minimum_stock: 0,
        is_active: true,
      });
    }
  }, [product, reset]);

  const onSubmit = (data: ProductFormData) => {
    const mutation = product
      ? updateProductMutation
      : createProductMutation;

    const payload = product
      ? {
        id: product.id,
        payload: data,
      }
      : data;

    mutation.mutate(payload as never, {
      onSuccess: () => {
        toast.success(
          product
            ? "Product updated successfully."
            : "Product created successfully."
        );

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
      className="space-y-6"
    >
      <ProductFormFields
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
      />

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