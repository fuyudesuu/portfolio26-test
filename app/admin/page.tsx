"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Field, Button, Toast, type ToastData } from "@/components/admin/ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [toast, setToast] = useState<ToastData>(null);

  // If already authenticated, skip to dashboard
  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) router.replace("/admin/dashboard");
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  async function handleLogin() {
    if (!username || !password) {
      setToast({ type: "error", message: "Enter username and password" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.replace("/admin/dashboard");
      } else {
        setToast({ type: "error", message: data.error || "Login failed" });
      }
    } catch {
      setToast({ type: "error", message: "Network error" });
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--fg-3)] text-sm">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[var(--accent-1)] flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--fg)]">Admin Access</h1>
          <p className="text-sm text-[var(--fg-3)] mt-1">Sign in to manage your content</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-card p-7 shadow-[0_4px_24px_var(--shadow)] flex flex-col gap-4">
          <Field label="Username" value={username} onChange={setUsername} placeholder="admin" />
          <Field label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
          <div className="mt-2">
            <div onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}>
              <Button onClick={handleLogin} loading={loading}>Sign in</Button>
            </div>
          </div>
        </div>
      </div>

      <Toast data={toast} onClose={() => setToast(null)} />
    </div>
  );
}
