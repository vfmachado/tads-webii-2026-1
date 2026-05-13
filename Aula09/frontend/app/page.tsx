"use client";

import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Bem-vindo, {user.name}</h1>
      <p className="text-slate-700">
        Este painel utiliza autenticação e permissões por usuário para liberar
        acesso aos módulos da plataforma.
      </p>
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold uppercase text-slate-500">
          Permissões ativas
        </h2>
        <ul className="flex flex-wrap gap-2">
          {user.permissions.map((permission) => (
            <li
              key={permission}
              className="rounded bg-slate-900 px-2 py-1 text-xs text-white"
            >
              {permission}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-sm text-slate-600">
        Acesse os módulos liberados no menu superior.
        {" "}
        <Link className="text-blue-700 underline" href="/usuarios">
          Gestão de usuários
        </Link>
        {" "}
        exige permissão `USUARIOS`.
      </p>
    </section>
  );
}
