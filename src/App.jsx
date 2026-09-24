import { useEffect, useState } from "react";
import { supabase, isConfigured } from "./supabaseClient";
import AuthForm from "./components/AuthForm";
import TaskBoard from "./components/TaskBoard";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <>
      <header className="topbar">
        <h1 className="brand">Taskboard</h1>
        {session && (
          <div className="user-area">
            <span>{session.user.email}</span>
            <button className="btn btn-ghost" type="button" onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}
      </header>

      <main>
        {!isConfigured ? (
          <section className="panel auth">
            <h2>Setup needed</h2>
            <p>
              Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to a .env file (local) or to
              your Vercel project's environment variables, then restart or redeploy.
            </p>
          </section>
        ) : loading ? (
          <p className="empty">Loading...</p>
        ) : session ? (
          <TaskBoard user={session.user} />
        ) : (
          <AuthForm />
        )}
      </main>
    </>
  );
}
