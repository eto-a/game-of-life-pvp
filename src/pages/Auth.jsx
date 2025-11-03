import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../features/auth/auth.slice";
import { useLoginMutation, useRegisterMutation } from "../features/auth/auth.api";
import { useLocation, useNavigate } from "react-router-dom";

export default function Auth() {
  const [tab, setTab] = useState("login");

  return (
    <main className="min-h-screen bg-white text-[var(--color-ink)]">
      <section className="py-16 md:py-20">
        <div className="container max-w-xl">
          <h1>{tab === "login" ? "Вход" : "Регистрация"}</h1>
          <div className="mt-4 flex gap-2">
            <button
              className={`btn ${tab === "login" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setTab("login")}
            >
              Войти
            </button>
            <button
              className={`btn ${tab === "register" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setTab("register")}
            >
              Регистрация
            </button>
          </div>

          <div className="mt-6 card p-4">
            {tab === "login" ? <LoginForm /> : <RegisterForm onSwitchToLogin={() => setTab("login")} />}
          </div>
        </div>
      </section>
    </main>
  );
}

function LoginForm() {
  const [identifier, setId] = useState("");
  const [password, setPw] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || "/lobby";

  const canSubmit = identifier.trim().length > 3 && password.length >= 6 && !isLoading;

  const onSubmit = async (e) => {
    e.preventDefault();
    const email = identifier.trim().toLowerCase();
    const res = await login({ identifier: email, password }).unwrap();
    dispatch(setAuth(res));        // { jwt, user }
    nav(from, { replace: true });  // редирект
  };

  const errText = getStrapiError(error);

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="label" htmlFor="email">Email</label>
      <input
        id="email"
        className="input"
        type="email"
        autoComplete="email"
        required
        value={identifier}
        onChange={(e) => setId(e.target.value)}
      />

      <label className="label" htmlFor="password">Пароль</label>
      <input
        id="password"
        className="input"
        type="password"
        autoComplete="current-password"
        required
        minLength={6}
        value={password}
        onChange={(e) => setPw(e.target.value)}
      />

      <button className="btn btn-primary" disabled={!canSubmit}>
        {isLoading ? "Входим…" : "Войти"}
      </button>

      {errText && <div className="muted text-sm">{errText}</div>}
    </form>
  );
}

function RegisterForm({ onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setMail] = useState("");
  const [password, setPw] = useState("");
  const [register, { isLoading, error }] = useRegisterMutation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || "/lobby";

  const canSubmit =
    username.trim().length >= 2 &&
    email.trim().length > 3 &&
    password.length >= 6 &&
    !isLoading;

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await register({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
    }).unwrap();
    dispatch(setAuth(res));         // { jwt, user }
    nav(from, { replace: true });   // редирект после регистрации
  };

  const errText = getStrapiError(error);

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="label" htmlFor="nick">Никнейм</label>
      <input
        id="nick"
        className="input"
        type="text"
        autoComplete="username"
        required
        minLength={2}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label className="label" htmlFor="reg-email">Email</label>
      <input
        id="reg-email"
        className="input"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setMail(e.target.value)}
      />

      <label className="label" htmlFor="reg-password">Пароль</label>
      <input
        id="reg-password"
        className="input"
        type="password"
        autoComplete="new-password"
        required
        minLength={6}
        value={password}
        onChange={(e) => setPw(e.target.value)}
      />

      <div className="flex items-center gap-2">
        <button className="btn btn-primary" disabled={!canSubmit}>
          {isLoading ? "Создаём…" : "Создать аккаунт"}
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={onSwitchToLogin}
          disabled={isLoading}
        >
          Уже есть аккаунт
        </button>
      </div>

      {errText && <div className="muted text-sm">{errText}</div>}
    </form>
  );
}

/** Достаёт человекочитаемую ошибку из ответа Strapi RTK Query */
function getStrapiError(error) {
  // RTK Query error shape: { status, data: { error: { message } } }
  return (
    error?.data?.error?.message ||
    error?.error ||
    null
  );
}
