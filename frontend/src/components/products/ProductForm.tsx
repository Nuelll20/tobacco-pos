import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import ProductFormFields from "@/components/products/ProductFormFields";
import { Button } from "@/components/ui/button";
import { useCreateProduct } from "@/hooks/useCreateProduct";
import { useUpdateProduct } from "@/hooks/useUpdateProduct";
import { getErrorMessage } from "@/lib/error";
import {
  productSchema,
  type ProductFormData,
} from "@/schemas/product";

import type { Product } from "@/types/product";

type ProductFormProps = {
  product?: Product | null;
  onSuccess?: () => void;
};

export default function ProductForm({
  product,
  onSuccess,
}: ProductFormProps) {
  const { t } = useTranslation();

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

  const createProductMutation =
    useCreateProduct();

  const updateProductMutation =
    useUpdateProduct();

  useEffect(() => {
    if (product) {
      reset({
        sku: product.sku,
        name: product.name,
        purchase_price:
          product.purchase_price,
        selling_price:
          product.selling_price,
        stock: product.stock,
        minimum_stock:
          product.minimum_stock,
        is_active: product.is_active,
      });

      return;
    }

    reset({
      sku: "",
      name: "",
      purchase_price: 0,
      selling_price: 0,
      stock: 0,
      minimum_stock: 0,
      is_active: true,
    });
  }, [product, reset]);

  const isSaving =
    createProductMutation.isPending ||
    updateProductMutation.isPending;

  function onSubmit(data: ProductFormData) {
    if (product) {
      updateProductMutation.mutate(
        {
          id: product.id,
          payload: data,
        },
        {
          onSuccess: () => {
            toast.success(
              t("products.toast.updated"),
            );

            reset();
            onSuccess?.();
          },

          onError: (error) => {
            toast.error(
              getErrorMessage(error),
            );
          },
        },
      );

      return;
    }

    createProductMutation.mutate(data, {
      onSuccess: () => {
        toast.success(
          t("products.toast.created"),
        );

        reset();
        onSuccess?.();
      },

      onError: (error) => {
        toast.error(
          getErrorMessage(error),
        );
      },
    });
  }

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
        disabled={isSaving}
      >
        {isSaving
          ? t("products.form.saving")
          : t("products.form.save")}
      </Button>
    </form>
  );
}