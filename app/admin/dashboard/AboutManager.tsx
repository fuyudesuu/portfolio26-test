"use client";

import { useState, useEffect } from "react";
import { Field, TextArea, TagInput, Button, type ToastData } from "@/components/admin/ui";

type Profile = {
  name: string;
  title: string;
  tagline: string;
  eyebrow: string;
  skills: string[];
  photo: string;
  bio: string;
  note: string;
};

const EMPTY: Profile = {
  name: "", title: "", tagline: "", eyebrow: "",
  skills: [], photo: "", bio: "", note: "",
};

export default function AboutManager({ setToast }: { setToast: (t: ToastData) => void }) {
  const [profile, setProfile] = useState<Profile>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content/about")
      .then((r) => r.json())
      .then((data) => {
        const p = data.profile || {};
        const n = data.note || {};
        setProfile({
          name: p.name || "",
          title: p.title || "",
          tagline: p.tagline || "",
          eyebrow: p.eyebrow || "",
          skills: p.skills || [],
          photo: p.photo || "",
          bio: p.bio || "",
          note: n.content || "",
        });
        setLoading(false);
      })
      .catch(() => {
        setToast({ type: "error", message: "Failed to load profile" });
        setLoading(false);
      });
  }, [setToast]);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/content/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ type: "success", message: "Profile updated" });
      } else {
        setToast({ type: "error", message: data.error || "Save failed" });
      }
    } catch {
      setToast({ type: "error", message: "Network error" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-[var(--fg-3)] text-sm py-8 text-center">Loading profile...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--fg)] mb-6">About / Profile</h2>

      <div className="flex flex-col gap-4 max-w-[600px]">
        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
          <Field label="Name" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} placeholder="Alex Nguyen" />
          <Field label="Title" value={profile.title} onChange={(v) => setProfile({ ...profile, title: v })} placeholder="Designer & Developer" />
        </div>
        <Field label="Eyebrow (small label above name)" value={profile.eyebrow} onChange={(v) => setProfile({ ...profile, eyebrow: v })} placeholder="designer · developer · creator" />
        <Field label="Tagline" value={profile.tagline} onChange={(v) => setProfile({ ...profile, tagline: v })} placeholder="Crafting expressive digital experiences from Saigon" />
        <TextArea label="Bio" value={profile.bio} onChange={(v) => setProfile({ ...profile, bio: v })} placeholder="I'm a product-minded engineer..." rows={5} />
        <TagInput label="Skills" tags={profile.skills} onChange={(t) => setProfile({ ...profile, skills: t })} />
        <TextArea label="Currently learning note" value={profile.note} onChange={(v) => setProfile({ ...profile, note: v })} placeholder="Currently exploring SwiftUI..." rows={2} />
        <Field label="Photo URL" value={profile.photo} onChange={(v) => setProfile({ ...profile, photo: v })} placeholder="https://..." />

        <div className="mt-2">
          <Button onClick={save} loading={saving}>Save profile</Button>
        </div>
      </div>
    </div>
  );
}
