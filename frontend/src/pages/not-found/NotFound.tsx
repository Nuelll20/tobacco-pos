import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-6xl font-bold">
        404
      </h1>

      <p className="text-muted-foreground">
        {t("notFound.description")}
      </p>

      <Link
        to="/"
        className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-opacity hover:opacity-90"
      >
        {t("notFound.backToDashboard")}
      </Link>
    </div>
  );
}