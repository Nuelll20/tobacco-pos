import TransactionForm from "@/components/transactions/TransactionForm";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TransactionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function TransactionDialog({
  open,
  onOpenChange,
}: TransactionDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>

          <DialogDescription>
            Select products, enter payment information, and save the sale.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <TransactionForm
            onSuccess={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
