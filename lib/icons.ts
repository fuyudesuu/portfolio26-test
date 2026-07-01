"use client";

import { Camera, Music, Code2, Bike, type LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Camera, Music, Code2, Bike,
};

export function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] || Code2;
}
