import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Input
        placeholder={t(
          "products.toolbar.searchPlaceholder",
        )}
        className="w-full sm:max-w-sm"
        value={search}
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
      />

      <Button
        type="button"
        className="w-full sm:w-auto"
        onClick={onAddProduct}
      >
        + {t("products.toolbar.addProduct")}
      </Button>
    </div>
  );
}