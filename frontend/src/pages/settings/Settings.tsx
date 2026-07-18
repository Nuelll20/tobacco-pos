import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppLanguage } from "@/hooks/useAppLanguage";
import type { AppLanguage } from "@/i18n";

export default function Settings() {
  const { t } = useTranslation();
  const { language, setLanguage } = useAppLanguage();

  function handleLanguageChange(
    nextLanguage: AppLanguage,
  ): void {
    if (nextLanguage === language) {
      return;
    }

    void setLanguage(nextLanguage);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("settings.title")}
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          {t("settings.description")}
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>
            {t("settings.language.title")}
          </CardTitle>

          <CardDescription>
            {t("settings.language.description")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant={
                language === "id"
                  ? "default"
                  : "outline"
              }
              className="h-auto justify-start px-4 py-3"
              aria-pressed={language === "id"}
              onClick={() =>
                handleLanguageChange("id")
              }
            >
              {t("settings.language.indonesian")}
            </Button>

            <Button
              type="button"
              variant={
                language === "en"
                  ? "default"
                  : "outline"
              }
              className="h-auto justify-start px-4 py-3"
              aria-pressed={language === "en"}
              onClick={() =>
                handleLanguageChange("en")
              }
            >
              {t("settings.language.english")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}