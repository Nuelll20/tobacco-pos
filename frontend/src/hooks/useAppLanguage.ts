import { useTranslation } from "react-i18next";

import type { AppLanguage } from "@/i18n";

export function useAppLanguage() {
  const { i18n } = useTranslation();

  const language: AppLanguage =
    i18n.resolvedLanguage === "en" ? "en" : "id";

  async function setLanguage(
    nextLanguage: AppLanguage,
  ): Promise<void> {
    await i18n.changeLanguage(nextLanguage);
  }

  return {
    language,
    setLanguage,
  };
}