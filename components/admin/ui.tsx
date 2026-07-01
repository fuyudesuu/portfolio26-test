"use client";

import { useState, type ReactNode } from "react";
import { X } from "lucide-react";

/* ─── Text input ─── */
export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-[var(--fg-2)]">
        {label} {required && <span className="text-[var(--accent-2)]">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-2)] border border-[var(--border)] text-[var(--fg)] text-sm outline-none focus:border-[var(--accent-1)] transition-colors font-[inherit] placeholder:text-[var(--fg-3)]"
      />
    </label>
  );
}

/* ─── Textarea ─── */
export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-[var(--fg-2)]">
        {label} {required && <span className="text-[var(--accent-2)]">*</span>}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-2)] border border-[var(--border)] text-[var(--fg)] text-sm outline-none focus:border-[var(--accent-1)] transition-colors font-[inherit] placeholder:text-[var(--fg-3)] resize-y leading-relaxed"
      />
    </label>
  );
}

/* ─── Select dropdown ─── */
export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-[var(--fg-2)]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-2)] border border-[var(--border)] text-[var(--fg)] text-sm outline-none focus:border-[var(--accent-1)] transition-colors font-[inherit] cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

/* ─── Tag multi-input ─── */
export function TagInput({
  label,
  tags,
  onChange,
}: {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function addTag() {
    const t = draft.trim();
    if (t && !tags.includes(t)) {
      onChange([...tags, t]);
    }
    setDraft("");
  }

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-[var(--fg-2)]">{label}</span>
      <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-[var(--bg-2)] border border-[var(--border)] min-h-[44px]">
        {tags.map((t) => (
          <span key={t} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[rgba(232,148,58,0.1)] text-[var(--accent-1)] border border-[rgba(232,148,58,0.2)]">
            {t}
            <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} className="hover:text-[var(--accent-2)]">
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); addTag(); }
          }}
          onBlur={addTag}
          placeholder={tags.length === 0 ? "Type and press Enter..." : ""}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-[var(--fg)] text-sm font-[inherit] placeholder:text-[var(--fg-3)]"
        />
      </div>
    </label>
  );
}

/* ─── Button ─── */
export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  loading,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
}) {
  const styles = {
    primary: "bg-[var(--accent-1)] text-white border-none hover:opacity-90",
    ghost: "bg-transparent text-[var(--fg)] border-[1.5px] border-[var(--border)] hover:border-[var(--fg-3)]",
    danger: "bg-transparent text-[var(--accent-2)] border-[1.5px] border-[rgba(232,93,74,0.3)] hover:bg-[rgba(232,93,74,0.08)]",
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-5 py-2.5 rounded-pill text-sm font-semibold cursor-pointer transition-all duration-200 outline-none font-[inherit] disabled:opacity-50 disabled:cursor-not-allowed ${styles}`}
    >
      {loading ? "Working..." : children}
    </button>
  );
}

/* ─── Toast notification ─── */
export type ToastData = { type: "success" | "error"; message: string } | null;

export function Toast({ data, onClose }: { data: ToastData; onClose: () => void }) {
  if (!data) return null;
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-xl text-sm font-medium shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex items-center gap-3 animate-[slideUp_0.3s_ease] ${
        data.type === "success"
          ? "bg-[var(--accent-1)] text-white"
          : "bg-[var(--accent-2)] text-white"
      }`}
    >
      {data.message}
      <button onClick={onClose} className="opacity-70 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
}
