import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function AuthForm() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", isError: false });
  const [busy, setBusy] = useState(false);

  function switchMode(newMode) {
    setMode(newMode);
    setMessage({ text: "", isError: false });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || password.length < 6) {
      setMessage({ text: "Enter an email and a password of at least 6 characters.", isError: true });
      return;
    }

    setBusy(true);
    if (mode === "register") {
      const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
      if (error) setMessage({ text: error.message, isError: true });
      else if (!data.session)
        setMessage({ text: "Account created. Check your email to confirm, then log in.", isError: false });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) setMessage({ text: error.message, isError: true });
    }
    setBusy(false);
  }

  return (
    <section className="panel auth">
      <div className="tabs" role="tablist">
        <button
          type="button"
          role="tab"
          className={`tab ${mode === "login" ? "active" : ""}`}
          onClick={() => switchMode("login")}
        >
          Log in
        </button>
        <button
          type="button"
          role="tab"
          className={`tab ${mode === "register" ? "active" : ""}`}
          onClick={() => switchMode("register")}
        >
          Create account
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {mode === "login" ? "Log in" : "Create account"}
        </button>
        <p className={`message ${message.isError ? "error" : ""}`} role="status">
          {message.text}
        </p>
      </form>
    </section>
  );
}
