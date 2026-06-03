import { FormEvent, useEffect, useState } from "react";

type UserRecord = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type ApiError = {
  message?: string;
};

const initialForm = {
  name: "",
  email: ""
};

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [createdUser, setCreatedUser] = useState<UserRecord | null>(null);
  const [createErrorMessage, setCreateErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [foundUser, setFoundUser] = useState<UserRecord | null>(null);
  const [searchErrorMessage, setSearchErrorMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const getApiErrorMessage = async (response: Response, fallbackMessage: string) => {
    const errorBody = (await response.json().catch(() => null)) as ApiError | null;

    return errorBody?.message ?? fallbackMessage;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setCreateErrorMessage("");
    setCreatedUser(null);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error(await getApiErrorMessage(response, "Nao foi possivel criar o usuario."));
      }

      const user = (await response.json()) as UserRecord;
      setCreatedUser(user);
      setForm(initialForm);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro inesperado.";
      setCreateErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSearching(true);
    setSearchErrorMessage("");
    setFoundUser(null);

    try {
      const response = await fetch(`/api/users/search?email=${encodeURIComponent(searchEmail)}`);

      if (!response.ok) {
        throw new Error(await getApiErrorMessage(response, "Nao foi possivel buscar o usuario."));
      }

      const user = (await response.json()) as UserRecord;
      setFoundUser(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro inesperado.";
      setSearchErrorMessage(message);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Aula 12</p>
          <h1>Cadastro e busca de usuarios com React + backend Express</h1>
          <p className="subtitle">
            A interface consome <code>POST /users</code> para cadastro e <code>GET /users/search</code>
            {" "}para consulta por e-mail.
          </p>
        </div>

        <div className="panel-grid">
          <section className="panel">
            <div className="panel-copy">
              <h2>Criar usuario</h2>
              <p>Cadastre um novo usuario e valide as regras do backend.</p>
            </div>

            <form className="user-form" onSubmit={handleSubmit}>
              <label className="field">
                <span>Nome</span>
                <input
                  name="name"
                  type="text"
                  placeholder="Ex.: Ada Lovelace"
                  value={form.name}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      name: event.target.value
                    }))
                  }
                  required
                />
              </label>

              <label className="field">
                <span>E-mail</span>
                <input
                  name="email"
                  type="email"
                  placeholder="ada@example.com"
                  value={form.email}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      email: event.target.value
                    }))
                  }
                  required
                />
              </label>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Criar usuario"}
              </button>
            </form>

            {createErrorMessage ? (
              <p className="feedback error" role="alert">
                {createErrorMessage}
              </p>
            ) : null}

            {createdUser ? (
              <article className="feedback success" aria-live="polite">
                <h2>Usuario criado com sucesso</h2>
                <p>
                  <strong>Nome:</strong> {createdUser.name}
                </p>
                <p>
                  <strong>E-mail:</strong> {createdUser.email}
                </p>
                <p>
                  <strong>ID:</strong> {createdUser.id}
                </p>
              </article>
            ) : null}
          </section>

          <section className="panel">
            <div className="panel-copy">
              <h2>Buscar por e-mail</h2>
              <p>Consulte um usuario ja cadastrado usando o email salvo no repositorio.</p>
            </div>

            <form className="user-form" onSubmit={handleSearch}>
              <label className="field">
                <span>E-mail para busca</span>
                <input
                  name="searchEmail"
                  type="email"
                  placeholder="ada@example.com"
                  value={searchEmail}
                  onChange={(event) => setSearchEmail(event.target.value)}
                  required
                />
              </label>

              <button type="submit" disabled={isSearching}>
                {isSearching ? "Buscando..." : "Buscar usuario"}
              </button>
            </form>

            {searchErrorMessage ? (
              <p className="feedback error" role="alert">
                {searchErrorMessage}
              </p>
            ) : null}

            {foundUser ? (
              <article className="feedback info" aria-live="polite">
                <h2>Usuario encontrado</h2>
                <p>
                  <strong>Nome:</strong> {foundUser.name}
                </p>
                <p>
                  <strong>E-mail:</strong> {foundUser.email}
                </p>
                <p>
                  <strong>ID:</strong> {foundUser.id}
                </p>
              </article>
            ) : null}
          </section>
        </div>
      </section>
    </main>
  );
}
