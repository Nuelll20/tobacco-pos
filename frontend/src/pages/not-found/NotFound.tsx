import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">404</h1>

      <p className="text-muted-foreground">
        Halaman yang Anda cari tidak ditemukan.
      </p>

      <Link
        to="/"
        className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}