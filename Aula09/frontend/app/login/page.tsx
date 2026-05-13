"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, authLoading, authError, clearAuthError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    clearAuthError();

    try {
      await login({ email, password });
      router.replace("/");
    } catch {
      // erro controlado pelo contexto
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold">Login</h1>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          required
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
        <input
          required
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2"
        />

        {authError ? <p className="text-sm text-rose-600">{authError}</p> : null}

        <button
          type="submit"
          disabled={authLoading}
          className="w-full rounded bg-slate-900 px-3 py-2 text-white disabled:opacity-60"
        >
          {authLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Não possui conta?{" "}
        <Link className="text-blue-700 underline" href="/cadastro">
          Cadastre-se
        </Link>
      </p>
    </section>
  );
}
