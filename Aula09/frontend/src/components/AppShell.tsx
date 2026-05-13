"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import type { Permission } from "@/src/types/auth";

const LINKS: { href: string; label: string; permission?: Permission }[] = [
  { href: "/", label: "Início" },
  { href: "/usuarios", label: "Usuários", permission: "USUARIOS" },
  { href: "/estoque", label: "Estoque", permission: "ESTOQUE" },
  { href: "/financeiro", label: "Financeiro", permission: "FINANCEIRO" },
  { href: "/relatorio", label: "Relatórios", permission: "RELATORIO" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, hasPermission, logout } = useAuth();

  const visibleLinks = LINKS.filter(
    (item) => !item.permission || (user && hasPermission(item.permission)),
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {user ? (
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
            <nav className="flex flex-wrap gap-2">
              {visibleLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-2 text-sm ${
                    pathname === link.href
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <button
              type="button"
              onClick={logout}
              className="rounded-md bg-rose-600 px-3 py-2 text-sm text-white"
            >
              Sair
            </button>
          </div>
        </header>
      ) : null}

      <main className="mx-auto w-full max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
