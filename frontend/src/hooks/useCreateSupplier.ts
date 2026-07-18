import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createSupplier,
} from "@/services/supplier.service";

import type {
  SupplierPayload,
} from "@/types/supplier";

export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: SupplierPayload,
    ) => createSupplier(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });
    },
  });
}