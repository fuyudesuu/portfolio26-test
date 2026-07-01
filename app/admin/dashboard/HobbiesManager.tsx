"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Field, TextArea, Select, Button, type ToastData } from "@/components/admin/ui";

type Hobby = {
  slug: string;
  title: string;
  icon: string;
  accentIndex: number;
  summary: string;
  content: string;
  image: string;
};

const EMPTY: Hobby = {
  slug: "", title: "", icon: "Camera", accentIndex: 1,
  summary: "", content: "", image: "",
};

const ICON_OPTIONS = [
  { value: "Camera", label: "Camera" },
  { value: "Music", label: "Music" },
  { value: "Code2", label: "Code" },
  { value: "Bike", label: "Bike" },
];

const ACCENT_OPTIONS = [
  { value: "1", label: "Amber" },
  { value: "2", label: "Coral" },
  { value: "3", label: "Terracotta" },
];

export default function HobbiesManager({ setToast }: { setToast: (t: ToastData) => void }) {
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Hobby | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/content/hobbies");
      const data = await res.json();
      setHobbies(data.hobbies || []);
    } catch {
      setToast({ type: "error", message: "Failed to load hobbies" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function startNew() { setEditing({ ...EMPTY }); setIsNew(true); }
  function startEdit(h: Hobby) { setEditing({ ...h }); setIsNew(false); }

  async function save() {
    if (!editing) return;
    if (!editing.title) {
      setToast({ type: "error", message: "Title is required" });
      return;
    }
    setSaving(true);
    try {
      const url = isNew ? "/api/content/hobbies" : `/api/content/hobbies/${editing.slug}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ type: "success", message: isNew ? "Hobby created" : "Hobby updated" });
        setEditing(null);
        await load();
      } else {
        setToast({ type: "error", message: data.error || "Save failed" });
      }
    } catch {
      setToast({ type: "error", message: "Network error" });
    } finally {
      setSaving(false);
    }
  }

  async function remove(slug: string) {
    if (!confirm("Delete this hobby? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/content/hobbies/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setToast({ type: "success", message: "Hobby deleted" });
        await load();
      } else {
        const data = await res.json();
        setToast({ type: "error", message: data.error || "Delete failed" });
      }
    } catch {
      setToast({ type: "error", message: "Network error" });
    }
  }

  if (editing) {
    return (
      <div>
        <button onClick={() => setEditing(null)} className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--fg-3)] hover:text-[var(--accent-1)] transition-colors bg-transparent border-none cursor-pointer mb-6 font-[inherit]">
          <ArrowLeft size={16} /> Back to list
        </button>

        <h2 className="text-xl font-bold text-[var(--fg)] mb-6">{isNew ? "New Hobby" : "Edit Hobby"}</h2>

        <div className="flex flex-col gap-4 max-w-[600px]">
          <Field label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="Photography" required />
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
            <Select label="Icon" value={editing.icon} onChange={(v) => setEditing({ ...editing, icon: v })} options={ICON_OPTIONS} />
            <Select label="Accent color" value={String(editing.accentIndex)} onChange={(v) => setEditing({ ...editing, accentIndex: Number(v) })} options={ACCENT_OPTIONS} />
          </div>
          <Field label="Summary" value={editing.summary} onChange={(v) => setEditing({ ...editing, summary: v })} placeholder="One-line description shown in previews" />
          <TextArea label="Full description" value={editing.content} onChange={(v) => setEditing({ ...editing, content: v })} placeholder="The full hobby description..." rows={6} />
          <Field label="Image URL" value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} placeholder="https://..." />

          <div className="flex gap-3 mt-2">
            <Button onClick={save} loading={saving}>{isNew ? "Publish" : "Save changes"}</Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[var(--fg)]">Hobbies <span className="text-[var(--fg-3)] font-normal text-base">({hobbies.length})</span></h2>
        <Button onClick={startNew}><span className="flex items-center gap-1.5"><Plus size={16} /> New Hobby</span></Button>
      </div>

      {loading ? (
        <p className="text-[var(--fg-3)] text-sm py-8 text-center">Loading hobbies...</p>
      ) : hobbies.length === 0 ? (
        <p className="text-[var(--fg-3)] text-sm py-8 text-center">No hobbies yet. Create your first one.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {hobbies.map((h) => (
            <div key={h.slug} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-bold text-[var(--fg)] truncate mb-0.5">{h.title}</h3>
                <p className="text-xs text-[var(--fg-3)] truncate">{h.summary}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => startEdit(h)} className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--fg-2)] hover:bg-[var(--bg-2)] hover:text-[var(--accent-1)] transition-colors bg-transparent border-none cursor-pointer">
                  <Pencil size={16} />
                </button>
                <button onClick={() => remove(h.slug)} className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--fg-2)] hover:bg-[rgba(232,93,74,0.08)] hover:text-[var(--accent-2)] transition-colors bg-transparent border-none cursor-pointer">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
