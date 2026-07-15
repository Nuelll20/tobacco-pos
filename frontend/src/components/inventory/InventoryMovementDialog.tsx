import InventoryMovementForm from "@/components/inventory/InventoryMovementForm";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type InventoryMovementDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function InventoryMovementDialog({
  open,
  onOpenChange,
}: InventoryMovementDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Inventory Movement</DialogTitle>

          <DialogDescription>
            Record stock in, stock out, or adjustment for a product.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <InventoryMovementForm
            onSuccess={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}