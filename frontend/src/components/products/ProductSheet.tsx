import { useState } from "react";

import ProductForm from "@/components/products/ProductForm";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function ProductSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          + Add Product
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            Add Product
          </SheetTitle>

          <SheetDescription>
            Fill in the information below to create a new product.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <ProductForm />
        </div>
      </SheetContent>
    </Sheet>
  );
}