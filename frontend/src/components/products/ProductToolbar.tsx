import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  onAddProduct: () => void;
};

export default function ProductToolbar({
  search,
  onSearchChange,
  onAddProduct,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Input
        placeholder="Search product..."
        className="w-full sm:max-w-sm"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <Button className="w-full sm:w-auto" onClick={onAddProduct}>
        + Add Product
      </Button>
    </div>
  );
}
