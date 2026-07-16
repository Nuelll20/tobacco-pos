import { useEffect } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
} from "lucide-react";

import { getErrorMessage } from "@/lib/error";

import { useCreateTransaction } from "@/hooks/useCreateTransaction";
import { useProducts } from "@/hooks/useProducts";
import {
  transactionSchema,
  type TransactionFormData,
} from "@/schemas/transaction";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

type TransactionFormProps = {
  onSuccess?: () => void;
};

export default function TransactionForm({
  onSuccess,
}: TransactionFormProps) {
  const {
    data: productsData,
    isLoading: isProductsLoading,
  } = useProducts({
    per_page: 100,
    sort_by: "name",
    sort_direction: "asc",
  });

  const products = (productsData?.data ?? []).filter(
    (product) => product.is_active
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      payment_method: "cash",
      paid_amount: 0,
      note: "",
      items: [
        {
          product_id: 0,
          quantity: 1,
        },
      ],
    },
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems =
    useWatch({
      control,
      name: "items",
    }) ?? [];

  const paymentMethod = useWatch({
    control,
    name: "payment_method",
  });

  const paidAmount =
    useWatch({
      control,
      name: "paid_amount",
    }) ?? 0;

  const itemSubtotals = watchedItems.map((item) => {
    const product = products.find(
      (currentProduct) =>
        currentProduct.id === item.product_id
    );

    const unitPrice = Number(
      product?.selling_price ?? 0
    );

    const quantity = Number(item.quantity) || 0;

    return unitPrice * quantity;
  });

  const totalAmount = itemSubtotals.reduce(
    (total, subtotal) => total + subtotal,
    0
  );

  const changeAmount =
    paymentMethod === "cash"
      ? Math.max(Number(paidAmount) - totalAmount, 0)
      : 0;

  const createTransactionMutation =
    useCreateTransaction();

  const isSaving =
    createTransactionMutation.isPending;

  useEffect(() => {
    if (
      paymentMethod === "qris" ||
      paymentMethod === "transfer"
    ) {
      setValue("paid_amount", totalAmount, {
        shouldValidate: true,
      });
    }
  }, [
    paymentMethod,
    setValue,
    totalAmount,
  ]);

  const onSubmit = (data: TransactionFormData) => {
    const hasInvalidStock = data.items.some((item) => {
      const product = products.find(
        (currentProduct) =>
          currentProduct.id === item.product_id
      );

      return (
        !product ||
        item.quantity > product.stock
      );
    });

    if (hasInvalidStock) {
      toast.error(
        "One or more quantities exceed available stock."
      );

      return;
    }

    if (
      data.payment_method === "cash" &&
      data.paid_amount < totalAmount
    ) {
      toast.error(
        "Paid amount must be at least the transaction total."
      );

      return;
    }

    createTransactionMutation.mutate(
      {
        payment_method: data.payment_method,
        paid_amount:
          data.payment_method === "cash"
            ? data.paid_amount
            : totalAmount,
        note: data.note || null,
        items: data.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      },
      {
        onSuccess: () => {
          toast.success(
            "Transaction created successfully."
          );

          reset({
            payment_method: "cash",
            paid_amount: 0,
            note: "",
            items: [
              {
                product_id: 0,
                quantity: 1,
              },
            ],
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
        <div className="space-y-2">
          <Label htmlFor="payment_method">
            Payment Method
          </Label>

          <select
            id="payment_method"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            {...register("payment_method")}
          >
            <option value="cash">Cash</option>
            <option value="qris">QRIS</option>
            <option value="transfer">Transfer</option>
          </select>

          {errors.payment_method && (
            <p className="text-sm text-destructive">
              {errors.payment_method.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="paid_amount">
            Paid Amount
          </Label>

          <Input
            id="paid_amount"
            type="number"
            min={0}
            step="0.01"
            readOnly={
              paymentMethod === "qris" ||
              paymentMethod === "transfer"
            }
            {...register("paid_amount", {
              valueAsNumber: true,
            })}
          />

          {errors.paid_amount && (
            <p className="text-sm text-destructive">
              {errors.paid_amount.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">
              Transaction Items
            </h3>

            <p className="text-sm text-muted-foreground">
              Add one or more products to the transaction.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isProductsLoading}
            onClick={() =>
              append({
                product_id: 0,
                quantity: 1,
              })
            }
          >
            <Plus className="mr-2 size-4" />
            Add Item
          </Button>
        </div>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid gap-4 rounded-lg border p-4 sm:grid-cols-[1fr_120px_160px_180px_auto]"
          >
            <div className="space-y-2">
              <Label htmlFor={`items.${index}.product_id`}>
                Product
              </Label>

              <select
                id={`items.${index}.product_id`}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                disabled={isProductsLoading}
                {...register(`items.${index}.product_id`, {
                  valueAsNumber: true,
                })}
              >
                <option value={0}>
                  {isProductsLoading
                    ? "Loading products..."
                    : "Select product"}
                </option>

                {products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                    disabled={product.stock < 1}
                  >
                    {product.name} - {product.sku} - Stock:{" "}
                    {product.stock}
                  </option>
                ))}
              </select>

              {errors.items?.[index]?.product_id && (
                <p className="text-sm text-destructive">
                  {
                    errors.items[index]?.product_id
                      ?.message
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`items.${index}.quantity`}>
                Quantity
              </Label>

              <Input
                id={`items.${index}.quantity`}
                type="number"
                min={1}
                max={
                  products.find(
                    (product) =>
                      product.id ===
                      watchedItems[index]?.product_id
                  )?.stock
                }
                {...register(`items.${index}.quantity`, {
                  valueAsNumber: true,
                })}
              />

              {errors.items?.[index]?.quantity && (
                <p className="text-sm text-destructive">
                  {
                    errors.items[index]?.quantity
                      ?.message
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Unit Price</Label>

              <div className="flex h-10 items-center justify-end rounded-md border bg-muted/40 px-3 text-sm">
                {formatCurrency(
                  Number(
                    products.find(
                      (product) =>
                        product.id ===
                        watchedItems[index]?.product_id
                    )?.selling_price ?? 0
                  )
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Subtotal</Label>

              <div className="flex h-10 items-center justify-end rounded-md border bg-muted/40 px-3 text-sm font-medium">
                {formatCurrency(itemSubtotals[index] ?? 0)}
              </div>
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={fields.length === 1}
                aria-label={`Remove item ${index + 1}`}
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}

        {typeof errors.items?.message === "string" && (
          <p className="text-sm text-destructive">
            {errors.items.message}
          </p>
        )}

        <div className="grid gap-4 rounded-lg border bg-muted/30 p-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">
              Transaction Total
            </p>

            <p className="mt-1 text-lg font-semibold">
              {formatCurrency(totalAmount)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Paid Amount
            </p>

            <p className="mt-1 text-lg font-semibold">
              {formatCurrency(Number(paidAmount) || 0)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Change
            </p>

            <p className="mt-1 text-lg font-semibold">
              {formatCurrency(changeAmount)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Note</Label>

        <textarea
          id="note"
          rows={3}
          placeholder="Optional transaction note"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          {...register("note")}
        />

        {errors.note && (
          <p className="text-sm text-destructive">
            {errors.note.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={
          isSaving ||
          isProductsLoading ||
          totalAmount <= 0
        }
      >
        {isSaving
          ? "Saving Transaction..."
          : "Save Transaction"}
      </Button>
    </form>
  );
}
