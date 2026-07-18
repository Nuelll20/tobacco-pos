import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deactivateSupplier,
} from "@/services/supplier.service";

export function useDeactivateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateSupplier,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });
    },
  });
}