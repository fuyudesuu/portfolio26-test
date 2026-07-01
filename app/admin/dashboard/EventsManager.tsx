"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, MapPin, Clock, ArrowLeft } from "lucide-react";
import { Field, TextArea, Select, TagInput, Button, type ToastData } from "@/components/admin/ui";

type Event = {
  slug: string;
  title: string;
  date: string;
  location: string;
  type: string;
  tags: string[];
  summary: string;
  content: string;
  image: string;
};

const EMPTY: Event = {
  slug: "", title: "", date: "", location: "", type: "speaker",
  tags: [], summary: "", content: "", image: "",
};

const TYPE_OPTIONS = [
  { value: "speaker", label: "Speaker" },
  { value: "organizer", label: "Organizer" },
  { value: "attendee", label: "Attendee" },
];

export default function EventsManager({ setToast }: { setToast: (t: ToastData) => void }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Event | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/content/events");
      const data = await res.json();
      setEvents(data.events || []);
    } catch {
      setToast({ type: "error", message: "Failed to load events" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function startNew() {
    setEditing({ ...EMPTY });
    setIsNew(true);
  }

  function startEdit(ev: Event) {
    setEditing({ ...ev });
    setIsNew(false);
  }

  async function save() {
    if (!editing) return;
    if (!editing.title || !editing.date) {
      setToast({ type: "error", message: "Title and date are required" });
      return;
    }
    setSaving(true);
    try {
      const url = isNew
        ? "/api/content/events"
        : `/api/content/events/${editing.slug}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ type: "success", message: isNew ? "Event created" : "Event updated" });
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
    if (!confirm("Delete this event? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/content/events/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setToast({ type: "success", message: "Event deleted" });
        await load();
      } else {
        const data = await res.json();
        setToast({ type: "error", message: data.error || "Delete failed" });
      }
    } catch {
      setToast({ type: "error", message: "Network error" });
    }
  }

  // ─── Edit form view ───
  if (editing) {
    return (
      <div>
        <button onClick={() => setEditing(null)} className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--fg-3)] hover:text-[var(--accent-1)] transition-colors bg-transparent border-none cursor-pointer mb-6 font-[inherit]">
          <ArrowLeft size={16} /> Back to list
        </button>

        <h2 className="text-xl font-bold text-[var(--fg)] mb-6">{isNew ? "New Event" : "Edit Event"}</h2>

        <div className="flex flex-col gap-4 max-w-[600px]">
          <Field label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="React Summit 2026" required />
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
            <Field label="Date" value={editing.date} onChange={(v) => setEditing({ ...editing, date: v })} type="date" required />
            <Select label="Type" value={editing.type} onChange={(v) => setEditing({ ...editing, type: v })} options={TYPE_OPTIONS} />
          </div>
          <Field label="Location" value={editing.location} onChange={(v) => setEditing({ ...editing, location: v })} placeholder="Amsterdam, Netherlands" />
          <TagInput label="Tags" tags={editing.tags} onChange={(t) => setEditing({ ...editing, tags: t })} />
          <Field label="Summary" value={editing.summary} onChange={(v) => setEditing({ ...editing, summary: v })} placeholder="One-line description shown in previews" />
          <TextArea label="Full write-up" value={editing.content} onChange={(v) => setEditing({ ...editing, content: v })} placeholder="The full event description..." rows={8} />
          <Field label="Cover image URL" value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} placeholder="https://..." />

          <div className="flex gap-3 mt-2">
            <Button onClick={save} loading={saving}>{isNew ? "Publish" : "Save changes"}</Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── List view ───
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[var(--fg)]">Events <span className="text-[var(--fg-3)] font-normal text-base">({events.length})</span></h2>
        <Button onClick={startNew}><span className="flex items-center gap-1.5"><Plus size={16} /> New Event</span></Button>
      </div>

      {loading ? (
        <p className="text-[var(--fg-3)] text-sm py-8 text-center">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-[var(--fg-3)] text-sm py-8 text-center">No events yet. Create your first one.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((ev) => (
            <div key={ev.slug} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-2)] text-[var(--fg-2)] capitalize">{ev.type}</span>
                  <h3 className="font-bold text-[var(--fg)] truncate">{ev.title}</h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--fg-3)]">
                  <span className="flex items-center gap-1"><Clock size={12} /> {ev.date}</span>
                  {ev.location && <span className="flex items-center gap-1"><MapPin size={12} /> {ev.location}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => startEdit(ev)} className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--fg-2)] hover:bg-[var(--bg-2)] hover:text-[var(--accent-1)] transition-colors bg-transparent border-none cursor-pointer">
                  <Pencil size={16} />
                </button>
                <button onClick={() => remove(ev.slug)} className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--fg-2)] hover:bg-[rgba(232,93,74,0.08)] hover:text-[var(--accent-2)] transition-colors bg-transparent border-none cursor-pointer">
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
