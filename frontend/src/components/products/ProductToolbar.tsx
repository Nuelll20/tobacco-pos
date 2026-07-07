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
    <div className="flex items-center justify-between gap-4">
      <Input
        placeholder="Search product..."
        className="max-w-sm"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <Button onClick={onAddProduct}>
        + Add Product
      </Button>
    </div>
  );
}