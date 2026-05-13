"use client";

import { RequireAuth } from "@/src/components/RequireAuth";

export default function FinanceiroPage() {
  return (
    <RequireAuth requiredPermission="FINANCEIRO">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Módulo Financeiro</h1>
        <p className="mt-2 text-slate-700">
          Área liberada apenas para usuários com permissão `FINANCEIRO`.
        </p>
      </section>
    </RequireAuth>
  );
}
