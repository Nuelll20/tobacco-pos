import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";

import "./index.css";
import "@/i18n";

import App from "./App";
import QueryProvider from "@/providers/QueryProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <App />
      <Toaster
        position="top-right"
        richColors
        closeButton
      />
    </QueryProvider>
  </StrictMode>,
);