import axios from "axios";

import i18n from "@/i18n";

const errorMessageKeyMap: Record<
  string,
  | "errors.skuTaken"
  | "errors.productNameTaken"
  | "errors.invalidData"
> = {
  "The sku has already been taken.":
    "errors.skuTaken",

  "The name has already been taken.":
    "errors.productNameTaken",

  "The given data was invalid.":
    "errors.invalidData",
};

function translateServerMessage(
  message: string,
): string {
  const translationKey =
    errorMessageKeyMap[message];

  return translationKey
    ? i18n.t(translationKey)
    : message;
}

export function getErrorMessage(
  error: unknown,
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    // Laravel validation errors
    if (data?.errors) {
      const firstField =
        Object.keys(data.errors)[0];

      if (firstField) {
        const firstMessage =
          data.errors[firstField]?.[0];

        if (
          typeof firstMessage === "string"
        ) {
          return translateServerMessage(
            firstMessage,
          );
        }
      }
    }

    // Laravel general message
    if (
      typeof data?.message === "string"
    ) {
      return translateServerMessage(
        data.message,
      );
    }
  }

  return i18n.t("errors.generic");
}