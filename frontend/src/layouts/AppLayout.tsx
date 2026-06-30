import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside>
        Sidebar
      </aside>

      <main className="flex-1">
        Header

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}