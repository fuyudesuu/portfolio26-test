import { getHobbies } from "@/lib/content";
import HobbiesPageClient from "./HobbiesPageClient";

export default function HobbiesPage() {
  const hobbies = getHobbies().map((h) => ({
    slug: h.slug,
    title: h.title,
    iconName: h.iconName,
    accentIndex: h.accentIndex,
    summary: h.summary,
    image: h.image,
    content: h.content,
  }));

  return <HobbiesPageClient hobbies={hobbies} />;
}
