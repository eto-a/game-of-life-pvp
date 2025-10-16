import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

