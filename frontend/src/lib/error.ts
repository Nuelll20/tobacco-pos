import axios from "axios";

const errorMessageMap: Record<string, string> = {
  "The sku has already been taken.": "SKU sudah digunakan.",
  "The name has already been taken.": "Nama produk sudah digunakan.",
  "The given data was invalid.": "Data yang dikirim tidak valid.",
};

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    // Laravel Validation Errors
    if (data?.errors) {
      const firstField = Object.keys(data.errors)[0];

      if (firstField) {
        const firstMessage = data.errors[firstField][0];

        return (
          errorMessageMap[firstMessage] ??
          firstMessage
        );
      }
    }

    // Laravel Message
    if (data?.message) {
      return (
        errorMessageMap[data.message] ??
        data.message
      );
    }
  }

  return "Terjadi kesalahan. Silakan coba lagi.";
}