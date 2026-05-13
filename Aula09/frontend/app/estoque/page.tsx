"use client";

import { RequireAuth } from "@/src/components/RequireAuth";

export default function EstoquePage() {
  return (
    <RequireAuth requiredPermission="ESTOQUE">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Módulo de Estoque</h1>
        <p className="mt-2 text-slate-700">
          Área liberada apenas para usuários com permissão `ESTOQUE`.
        </p>
      </section>
    </RequireAuth>
  );
}
