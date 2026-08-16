import { useEffect, useState } from "react";
import client from "../api/client";

const STORAGE_KEY = "portfolio_admin_token";

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY) || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [messages, setMessages] = useState(null);
  const [loadError, setLoadError] = useState("");

  const authHeader = (t) => ({ headers: { Authorization: `Bearer ${t}` } });

  const loadMessages = (t) => {
    setLoadError("");
    client
      .get("/contact", authHeader(t))
      .then((res) => setMessages(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem(STORAGE_KEY);
          setToken("");
          setMessages(null);
        } else {
          setLoadError("Could not reach the server.");
        }
      });
  };

  useEffect(() => {
    if (token) loadMessages(token);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    client
      .post("/auth/login", { email, password })
      .then((res) => {
        localStorage.setItem(STORAGE_KEY, res.data.token);
        setToken(res.data.token);
        loadMessages(res.data.token);
      })
      .catch((err) => {
        setLoginError(err.response?.data?.error || "Login failed.");
      })
      .finally(() => setLoggingIn(false));
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setToken("");
    setMessages(null);
    setEmail("");
    setPassword("");
  };

  const toggleRead = (msg) => {
    client
      .patch(`/contact/${msg._id}/read`, { read: !msg.read }, authHeader(token))
      .then((res) => setMessages((prev) => prev.map((m) => (m._id === msg._id ? res.data : m))));
  };

  const remove = (msg) => {
    if (!confirm(`Delete the message from ${msg.name}? This can't be undone.`)) return;
    client
      .delete(`/contact/${msg._id}`, authHeader(token))
      .then(() => setMessages((prev) => prev.filter((m) => m._id !== msg._id)));
  };

  if (!token || messages === null) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
        <p className="eyebrow">Restricted</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Admin login</h1>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoFocus
            required
            className="w-full rounded border border-line bg-surface px-4 py-3 font-mono text-sm text-ink placeholder:text-muted focus:border-signal focus:outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full rounded border border-line bg-surface px-4 py-3 font-mono text-sm text-ink placeholder:text-muted focus:border-signal focus:outline-none"
          />
          <button
            type="submit"
            disabled={loggingIn}
            className="w-full rounded bg-signal py-3 font-mono text-sm font-semibold text-base transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loggingIn ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {loginError && <p className="mt-4 font-mono text-xs text-danger">{loginError}</p>}
        {loadError && <p className="mt-4 font-mono text-xs text-danger">{loadError}</p>}
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
            Messages{" "}
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-signal px-2.5 py-1 align-middle font-mono text-xs text-base">
                {unreadCount} unread
              </span>
            )}
          </h1>
        </div>
        <button onClick={logout} className="font-mono text-xs uppercase tracking-wider text-muted hover:text-signal">
          Log out
        </button>
      </div>

      {messages.length === 0 ? (
        <p className="readout">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m._id} className={`panel p-6 ${m.read ? "opacity-70" : "border-signal/40"}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-display text-base font-semibold text-ink">
                    {m.name} <span className="font-mono text-sm font-normal text-muted">· {m.email}</span>
                  </p>
                  <p className="mt-1 text-sm text-data">{m.subject}</p>
                </div>
                <span className="readout shrink-0">{new Date(m.createdAt).toLocaleString()}</span>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink/85">{m.message}</p>

              <div className="mt-5 flex gap-4 font-mono text-xs uppercase tracking-wider">
                <button onClick={() => toggleRead(m)} className="text-signal hover:underline">
                  Mark as {m.read ? "unread" : "read"}
                </button>
                <a href={`mailto:${m.email}`} className="text-data hover:underline">
                  Reply
                </a>
                <button onClick={() => remove(m)} className="text-danger hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}