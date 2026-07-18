import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateSupplier,
} from "@/services/supplier.service";

import type {
  SupplierPayload,
} from "@/types/supplier";

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: SupplierPayload;
    }) => updateSupplier(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });
    },
  });
}