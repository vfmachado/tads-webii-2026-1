"use client";

import { FormEvent, useEffect, useState } from "react";
import { RequireAuth } from "@/src/components/RequireAuth";
import { useAuth } from "@/src/context/AuthContext";
import { userService } from "@/src/services/userService";
import type { Permission, User } from "@/src/types/auth";

const PERMISSIONS: Permission[] = ["USUARIOS", "ESTOQUE", "FINANCEIRO", "RELATORIO"];

export default function UsuariosPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [permissions, setPermissions] = useState<Permission[]>([]);

  async function loadUsers(showLoading = true) {
    if (!token) return;

    if (showLoading) {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await userService.list(token);
      setUsers(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar usuários.");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    async function bootstrapUsers() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await userService.list(token);
        setUsers(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar usuários.");
      } finally {
        setLoading(false);
      }
    }

    void bootstrapUsers();
  }, [token]);

  function togglePermission(value: Permission) {
    setPermissions((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!token) return;

    setError(null);

    try {
      await userService.create({ name, email, password, permissions }, token);
      setName("");
      setEmail("");
      setPassword("");
      setPermissions([]);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar usuário.");
    }
  }

  async function handlePermissionUpdate(userId: string, values: Permission[]) {
    if (!token) return;

    try {
      const updated = await userService.updatePermissions(userId, values, token);
      setUsers((current) => current.map((u) => (u.id === userId ? updated : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar permissões.");
    }
  }

  return (
    <RequireAuth requiredPermission="USUARIOS">
      <section className="space-y-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>

        <form onSubmit={handleCreate} className="space-y-3 rounded-lg bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Novo usuário</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <input
              required
              minLength={3}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nome"
              className="rounded border border-slate-300 px-3 py-2"
            />
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="E-mail"
              className="rounded border border-slate-300 px-3 py-2"
            />
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Senha"
              className="rounded border border-slate-300 px-3 py-2"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {PERMISSIONS.map((permission) => (
              <label key={permission} className="rounded border border-slate-300 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={permissions.includes(permission)}
                  onChange={() => togglePermission(permission)}
                  className="mr-2"
                />
                {permission}
              </label>
            ))}
          </div>

          <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white">
            Cadastrar usuário
          </button>
        </form>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Usuários cadastrados</h2>
          {loading ? <p className="text-sm text-slate-500">Carregando...</p> : null}
          {!loading && users.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum usuário encontrado.</p>
          ) : null}

          <ul className="space-y-3">
            {users.map((user) => (
              <li key={user.id} className="rounded-lg bg-white p-4 shadow-sm">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PERMISSIONS.map((permission) => {
                    const active = user.permissions.includes(permission);

                    return (
                      <button
                        key={permission}
                        type="button"
                        className={`rounded px-2 py-1 text-xs ${
                          active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                        onClick={() => {
                          const next = active
                            ? user.permissions.filter((item) => item !== permission)
                            : [...user.permissions, permission];

                          void handlePermissionUpdate(user.id, next);
                        }}
                      >
                        {permission}
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </RequireAuth>
  );
}
