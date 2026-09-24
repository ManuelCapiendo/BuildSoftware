import { useEffect, useState } from "react";
import { supabase, isConfigured } from "./supabaseClient";

export default function App() {
  const [status, setStatus] = useState(
    isConfigured ? "Checking connection..." : "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY."
  );

  useEffect(() => {
    if (!isConfigured) return;

    supabase
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .then(({ error }) => {
        setStatus(error ? "Connection error: " + error.message : "Connected to Supabase.");
      });
  }, []);

  return (
    <>
      <header className="topbar">
        <h1 className="brand">Taskboard</h1>
      </header>
      <main>
        <section className="panel auth">
          <h2>Setup check</h2>
          <p>{status}</p>
        </section>
      </main>
    </>
  );
}
