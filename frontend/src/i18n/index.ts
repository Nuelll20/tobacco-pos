import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/i18n/locales/en";
import id from "@/i18n/locales/id";

export const LANGUAGE_STORAGE_KEY = "tobacco-pos-language";

export type AppLanguage = "id" | "en";

function normalizeLanguage(
  language: string | null | undefined,
): AppLanguage {
  return language === "en" ? "en" : "id";
}

function getInitialLanguage(): AppLanguage {
  if (typeof window === "undefined") {
    return "id";
  }

  return normalizeLanguage(
    window.localStorage.getItem(LANGUAGE_STORAGE_KEY),
  );
}

function syncLanguagePreference(
  language: string | null | undefined,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedLanguage = normalizeLanguage(language);

  window.localStorage.setItem(
    LANGUAGE_STORAGE_KEY,
    normalizedLanguage,
  );

  document.documentElement.lang = normalizedLanguage;
}

const initialLanguage = getInitialLanguage();

i18n.on("languageChanged", syncLanguagePreference);

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      id: {
        translation: id,
      },
      en: {
        translation: en,
      },
    },
    lng: initialLanguage,
    fallbackLng: "id",
    supportedLngs: ["id", "en"],
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => {
    syncLanguagePreference(
      i18n.resolvedLanguage ?? initialLanguage,
    );
  });

export default i18n;