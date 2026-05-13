"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function CadastroPage() {
  const router = useRouter();
  const { register, authLoading, authError, clearAuthError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    clearAuthError();

    try {
      await register({ name, email, cpf, password });
      router.replace("/");
    } catch {
      // erro controlado pelo contexto
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold">Cadastro</h1>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          required
          placeholder="Nome"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
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
          minLength={11}
          maxLength={11}
          placeholder="CPF (somente números)"
          value={cpf}
          onChange={(event) => setCpf(event.target.value.replace(/\D/g, ""))}
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
          {authLoading ? "Cadastrando..." : "Criar conta"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Já possui conta?{" "}
        <Link className="text-blue-700 underline" href="/login">
          Fazer login
        </Link>
      </p>
    </section>
  );
}
