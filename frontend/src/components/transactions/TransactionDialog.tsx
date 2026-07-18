import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            {t("transactions.dialog.title")}
          </DialogTitle>

          <DialogDescription>
            {t("transactions.dialog.description")}
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